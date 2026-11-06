import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sponsorship from '@/models/Sponsorship';
import SponsorshipPayment from '@/models/SponsorshipPayment';
import FamilyMember from '@/models/FamilyMember';
import { RazorpaySubscriptionService } from '@/lib/services/razorpay-subscription.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = RazorpaySubscriptionService.verifyWebhookSignature(
      body,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    await connectDB();

    // Check if this event belongs to a SadqaSubscription
    const subscriptionEntity = event.payload?.subscription?.entity;
    if (subscriptionEntity?.id) {
      const sponsorship = await Sponsorship.findOne({ razorpaySubscriptionId: subscriptionEntity.id });
      if (!sponsorship) {
        const SadqaSubscription = (await import('@/models/SadqaSubscription')).default;
        const sadqaSub = await SadqaSubscription.findOne({ razorpaySubscriptionId: subscriptionEntity.id });
        if (sadqaSub) {
          const { SadqaSubscriptionService } = await import('@/lib/services/sadqa-subscription.service');
          await SadqaSubscriptionService.processSubscriptionWebhook(event);
          return NextResponse.json({ success: true, handledBy: 'SadqaSubscriptionService' });
        }
      }
    }

    switch (event.event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
        
      case 'subscription.charged':
        await handleSubscriptionCharged(event.payload.payment.entity, event.payload.subscription.entity);
        // Also update beneficiary on first payment
        await handleFirstPayment(event.payload.subscription.entity);
        break;
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
        
      case 'subscription.paused':
        await handleSubscriptionPaused(event.payload.subscription.entity);
        break;
        
      case 'subscription.resumed':
        await handleSubscriptionResumed(event.payload.subscription.entity);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
        
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(subscription: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: subscription.id 
    });

    if (sponsorship) {
      sponsorship.status = 'active';
      sponsorship.nextPaymentDate = new Date(subscription.current_end * 1000);
      await sponsorship.save();

      console.log('Subscription activated (beneficiary will be updated after first payment):', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription activation:', error);
  }
}

async function handleSubscriptionCharged(payment: any, subscription: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: subscription.id 
    });

    if (sponsorship) {
      // Create payment record
      const sponsorshipPayment = new SponsorshipPayment({
        sponsorshipId: sponsorship._id,
        sponsorId: sponsorship.sponsorId,
        beneficiaryId: sponsorship.beneficiaryId,
        amount: payment.amount / 100, // Convert from paise
        razorpayPaymentId: payment.id,
        razorpaySubscriptionId: subscription.id,
        status: 'paid',
        paymentDate: new Date(payment.created_at * 1000),
        dueDate: new Date(subscription.current_start * 1000),
        paidAt: new Date(payment.created_at * 1000),
        paymentMethod: payment.method
      });

      await sponsorshipPayment.save();

      // Update sponsorship
      sponsorship.totalPaid += payment.amount / 100;
      sponsorship.paymentCount += 1;
      sponsorship.lastPaymentDate = new Date(payment.created_at * 1000);
      sponsorship.nextPaymentDate = new Date(subscription.current_end * 1000);
      await sponsorship.save();

      console.log('Payment recorded:', payment.id);
    }
  } catch (error) {
    console.error('Error handling subscription charge:', error);
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: subscription.id 
    });

    if (sponsorship) {
      sponsorship.status = 'cancelled';
      sponsorship.endDate = new Date();
      await sponsorship.save();

      // Mark beneficiary as available again
      await FamilyMember.findByIdAndUpdate(sponsorship.beneficiaryId, {
        'sponsorship.isSponsored': false,
        'sponsorship.sponsoredAt': null,
        'sponsorship.sponsorId': null
      });

      console.log('Subscription cancelled:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleSubscriptionPaused(subscription: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: subscription.id 
    });

    if (sponsorship) {
      sponsorship.status = 'paused';
      await sponsorship.save();
      console.log('Subscription paused:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription pause:', error);
  }
}

async function handleSubscriptionResumed(subscription: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: subscription.id 
    });

    if (sponsorship) {
      sponsorship.status = 'active';
      sponsorship.nextPaymentDate = new Date(subscription.current_end * 1000);
      await sponsorship.save();
      console.log('Subscription resumed:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription resume:', error);
  }
}

async function handleFirstPayment(subscription: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: subscription.id 
    });

    if (sponsorship && sponsorship.paymentCount === 1) {
      // This is the first payment, mark beneficiary as sponsored
      await FamilyMember.findByIdAndUpdate(sponsorship.beneficiaryId, {
        'sponsorship.isSponsored': true,
        'sponsorship.sponsoredAt': new Date(),
        'sponsorship.sponsorId': sponsorship.sponsorId
      });

      console.log('First payment processed, beneficiary marked as sponsored:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling first payment:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    const sponsorship = await Sponsorship.findOne({ 
      razorpaySubscriptionId: payment.subscription_id 
    });

    if (sponsorship) {
      // Create failed payment record
      const sponsorshipPayment = new SponsorshipPayment({
        sponsorshipId: sponsorship._id,
        sponsorId: sponsorship.sponsorId,
        beneficiaryId: sponsorship.beneficiaryId,
        amount: payment.amount / 100,
        razorpayPaymentId: payment.id,
        razorpaySubscriptionId: payment.subscription_id,
        status: 'failed',
        paymentDate: new Date(payment.created_at * 1000),
        dueDate: new Date(payment.created_at * 1000),
        failureReason: payment.error_description || 'Payment failed'
      });

      await sponsorshipPayment.save();
      console.log('Payment failed:', payment.id);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}