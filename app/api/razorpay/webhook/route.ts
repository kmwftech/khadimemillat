import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyWebhookSignature } from '@/lib/services/razorpay.service'
import { addBreadcrumb, captureException } from '@/lib/observability/sentry'
import CampaignDonation from '@/models/CampaignDonation'
import { purchaseService } from '@/lib/services/purchase.service'
import WebhookEvent from '@/models/WebhookEvent'

export async function POST(req: NextRequest) {
  let raw: string | Buffer = ''
  try {
    raw = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''
    if (!signature) return NextResponse.json({ error: 'Signature missing' }, { status: 400 })
  const ok = verifyWebhookSignature({ rawBody: raw, signature })
    if (!ok) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })

    const event = JSON.parse(raw.toString())
  addBreadcrumb({ category: 'payments', message: 'webhook received', level: 'info', data: { event: event.event } })
    await connectDB()

    // Idempotency: upsert event id; if already processed, no-op
    const processed = await WebhookEvent.findOneAndUpdate(
      { id: event.id },
      { $setOnInsert: { id: event.id, receivedAt: new Date() } },
      { upsert: true, new: false }
    )
    if (processed) return NextResponse.json({ received: true })

    const eventType: string = event.event
    const payment = event.payload?.payment?.entity
    const order = event.payload?.order?.entity
    const subscription = event.payload?.subscription?.entity
    const invoice = event.payload?.invoice?.entity
    const invoiceSubscriptionId = invoice?.subscription_id

    // Handle invoice.paid for subscriptions
    if (eventType === 'invoice.paid' && invoiceSubscriptionId) {
      try {
        const { SadqaSubscriptionService } = await import('@/lib/services/sadqa-subscription.service')
        await SadqaSubscriptionService.handleInvoicePaid(event.payload)
        addBreadcrumb({
          category: 'subscriptions',
          message: 'invoice.paid processed for subscription',
          level: 'info',
          data: { subscriptionId: invoiceSubscriptionId, invoiceId: invoice?.id }
        })
      } catch (invoiceError) {
        console.error('[INVOICE_PAID_WEBHOOK_ERROR]', invoiceError)
      }
    }

    // Handle subscription events
    if (eventType === 'subscription.authenticated' || eventType === 'subscription.activated' || eventType === 'subscription.charged' || eventType === 'subscription.halted' || eventType === 'subscription.cancelled') {
      try {
        // Check if it's a sponsorship subscription by looking at notes
        const subscriptionNotes = subscription?.notes || {}
        const isSponsorship = subscriptionNotes.type === 'sponsorship' || subscriptionNotes.beneficiaryId

        if (isSponsorship) {
          // Handle sponsorship subscription
          console.log(`[SPONSORSHIP_WEBHOOK] Processing ${eventType} for sponsorship subscription: ${subscription?.id}`)
          
          const { RazorpaySubscriptionService } = await import('@/lib/services/razorpay-subscription.service')
          await RazorpaySubscriptionService.processSponsorshipWebhook(event)
          
          addBreadcrumb({ 
            category: 'sponsorships', 
            message: `sponsorship subscription event processed: ${eventType}`, 
            level: 'info', 
            data: { subscriptionId: subscription?.id, beneficiaryId: subscriptionNotes.beneficiaryId } 
          })
        } else {
          // Handle sadqa subscription
          const { SadqaSubscriptionService } = await import('@/lib/services/sadqa-subscription.service')
          await SadqaSubscriptionService.processSubscriptionWebhook(event)
          addBreadcrumb({ 
            category: 'subscriptions', 
            message: `sadqa subscription event processed: ${eventType}`, 
            level: 'info', 
            data: { subscriptionId: subscription?.id } 
          })
        }
      } catch (subscriptionError) {
        console.error('[SUBSCRIPTION_WEBHOOK_ERROR]', subscriptionError)
        captureException(subscriptionError, { 
          route: 'razorpay-webhook-subscription',
          extra: { eventType, subscriptionId: subscription?.id }
        })
      }
    }

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const orderId = order?.id || payment?.order_id
      const paymentId = payment?.id
      const receipt: string | undefined = order?.receipt

      // 1. Try resolving Donation by receipt, notes, or orderId/paymentId
      let donationId = receipt?.startsWith('donation_') ? receipt.replace('donation_', '') : undefined
      if (!donationId) {
        donationId = order?.notes?.donationId || payment?.notes?.donationId
      }

      let donation = null
      if (donationId) {
        donation = await CampaignDonation.findById(donationId)
      }
      if (!donation && orderId) {
        donation = await CampaignDonation.findOne({ razorpayOrderId: orderId })
      }
      if (!donation && paymentId) {
        donation = await CampaignDonation.findOne({ razorpayPaymentId: paymentId })
      }

      if (donation) {
        if (!donation.paymentVerified || donation.status !== 'completed') {
          donation.razorpayOrderId = orderId || donation.razorpayOrderId
          donation.razorpayPaymentId = paymentId || donation.razorpayPaymentId
          donation.paymentVerified = true
          donation.paymentVerifiedAt = new Date()
          donation.status = 'completed'
          donation.processedAt = donation.processedAt || new Date()
          await donation.save()
          addBreadcrumb({ category: 'payments', message: 'donation marked completed via webhook', level: 'info', data: { donationId: donation._id } })
          
          // Send thank you notifications after successful donation
          try {
            const { sendDonationThankYouNotifications } = await import('@/lib/services/donation-notification.service')
            await sendDonationThankYouNotifications(donation)
          } catch (notifyError) {
            console.warn('[DONATION_NOTIFICATION_FAILED_WEBHOOK]', notifyError)
          }
        }
      } else {
        // 2. Try resolving Scrap Purchase
        let scrapItemId = receipt?.startsWith('scrap_') ? receipt.replace('scrap_', '') : undefined
        if (!scrapItemId) {
          scrapItemId = order?.notes?.scrapItemId || payment?.notes?.scrapItemId
        }

        if (scrapItemId) {
          try {
            const completed = await purchaseService.completePurchaseFromWebhook({ scrapItemId, razorpayOrderId: orderId, razorpayPaymentId: paymentId, completedBy: 'system' })
            if (completed) {
              addBreadcrumb({ category: 'payments', message: 'purchase completed via webhook', level: 'info', data: { purchaseId: String(completed._id), scrapItemId } })
            }
          } catch (e) {
            addBreadcrumb({ category: 'payments', message: 'webhook completion error', level: 'warning', data: { error: (e as any)?.message, scrapItemId } })
          }
        } else if (orderId) {
          // Check if there is a pending purchase by orderId
          try {
            const Purchase = (await import('@/models/Purchase')).default
            const pendingPurchase = await Purchase.findOne({ razorpayOrderId: orderId, paymentStatus: 'pending' })
            if (pendingPurchase) {
              const completed = await purchaseService.completePurchaseFromWebhook({ scrapItemId: String(pendingPurchase.scrapItemId), razorpayOrderId: orderId, razorpayPaymentId: paymentId, completedBy: 'system' })
              if (completed) {
                addBreadcrumb({ category: 'payments', message: 'purchase completed by orderId via webhook', level: 'info', data: { purchaseId: String(completed._id) } })
              }
            }
          } catch (e) {
            console.warn('[PURCHASE_ORDER_LOOKUP_WARN]', e)
          }
        }

        // 3. Check if this payment belongs to a Subscription invoice
        if (payment?.invoice_id || payment?.notes?.type === 'sadqa' || order?.notes?.type === 'sadqa') {
          try {
            const { SadqaSubscriptionService } = await import('@/lib/services/sadqa-subscription.service')
            const SadqaSubscription = (await import('@/models/SadqaSubscription')).default
            const sub = await SadqaSubscription.findOne({
              $or: [
                { razorpayPaymentId: paymentId },
                { razorpayOrderId: orderId }
              ]
            })
            if (sub) {
              await SadqaSubscriptionService.syncSubscriptionStatus(sub._id.toString())
            }
          } catch (subErr) {
            console.warn('[SUBSCRIPTION_PAYMENT_SYNC_WARN]', subErr)
          }
        }
      }
    }

    // For other events, accept and ignore
    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[RAZORPAY_WEBHOOK]', e)
    captureException(e, { route: 'razorpay-webhook' })
    // Always return 200 to prevent retries storm, but include error info
    return NextResponse.json({ received: true, error: 'logged' })
  }
}
