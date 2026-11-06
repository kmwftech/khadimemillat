import Razorpay from 'razorpay'
import crypto from 'crypto'

type Currency = 'INR'

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } = process.env

let razorpayInstance: Razorpay | null = null

function getRazorpay() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET')
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  }
  return razorpayInstance
}

export async function createDonationOrder(params: { 
  amount: number; 
  currency: Currency; 
  donationId: string; 
  donorEmail?: string; 
  donorPhone?: string;
  receiptPreferences?: {
    email?: boolean;
    sms?: boolean;
    razorpayManaged?: boolean;
  }
}) {
  const rp = getRazorpay()
  const options: any = {
    amount: Math.round(params.amount * 100),
    currency: params.currency,
    receipt: `donation_${params.donationId}`,
    notes: {
      type: 'donation',
      donationId: params.donationId,
      email: params.donorEmail || '',
      phone: params.donorPhone || ''
    }
  }

  // Add receipt preferences to Razorpay order if razorpayManaged is enabled
  // Note: Razorpay receipts are limited in test mode but work in live mode
  if (params.receiptPreferences?.razorpayManaged) {
    options.receipt = `donation_${params.donationId}` // Ensure receipt is provided for Razorpay
    
    // Store only essential receipt information in notes
    if (params.receiptPreferences.email && params.donorEmail) {
      options.notes.receipt_email = params.donorEmail
    }
    
    if (params.receiptPreferences.sms && params.donorPhone) {
      options.notes.receipt_phone = params.donorPhone
    }
    
    console.log('[RAZORPAY_RECEIPT_ENABLED]', {
      orderId: `donation_${params.donationId}`,
      email: !!params.receiptPreferences.email,
      sms: !!params.receiptPreferences.sms,
      testMode: !RAZORPAY_KEY_ID?.startsWith('rzp_live_')
    })
  }

  const order = await rp.orders.create(options)
  return { id: order.id, amount: order.amount, currency: order.currency }
}

export async function createPurchaseOrder(params: { amount: number; currency: Currency; scrapItemId: string; buyerEmail: string; buyerPhone?: string }) {
  const rp = getRazorpay()
  const options: any = {
    amount: Math.round(params.amount * 100),
    currency: params.currency,
    receipt: `scrap_${params.scrapItemId}`,
    notes: {
      type: 'purchase',
      scrapItemId: params.scrapItemId,
      email: params.buyerEmail,
      phone: params.buyerPhone || ''
    }
  }
  const order = await rp.orders.create(options)
  return { id: order.id, amount: order.amount, currency: order.currency }
}

export function verifyPaymentSignature({ orderId, paymentId, signature }: { orderId: string; paymentId: string; signature: string }): boolean {
  if (!RAZORPAY_KEY_SECRET) throw new Error('RAZORPAY_KEY_SECRET is missing')
  const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
  hmac.update(`${orderId}|${paymentId}`)
  const digest = hmac.digest('hex')
  // constant-time comparison
  const sigBuf = Buffer.from(signature)
  const digBuf = Buffer.from(digest)
  return sigBuf.length === digBuf.length && crypto.timingSafeEqual(sigBuf, digBuf)
}

export function verifySubscriptionSignature({ subscriptionId, paymentId, signature }: { subscriptionId: string; paymentId: string; signature: string }): boolean {
  if (!RAZORPAY_KEY_SECRET) throw new Error('RAZORPAY_KEY_SECRET is missing')
  const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
  hmac.update(`${paymentId}|${subscriptionId}`)
  const digest = hmac.digest('hex')
  const sigBuf = Buffer.from(signature)
  const digBuf = Buffer.from(digest)
  return sigBuf.length === digBuf.length && crypto.timingSafeEqual(sigBuf, digBuf)
}

export function verifyWebhookSignature({ rawBody, signature }: { rawBody: string | Buffer; signature: string }): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) throw new Error('RAZORPAY_WEBHOOK_SECRET is missing')
  const expected = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex')
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)
}

export async function fetchPaymentDetails({ paymentId }: { paymentId: string }) {
  const rp = getRazorpay()
  return rp.payments.fetch(paymentId)
}

export async function fetchOrderDetails({ orderId }: { orderId: string }) {
  const rp = getRazorpay()
  return rp.orders.fetch(orderId)
}

export const razorpayService = {
  createDonationOrder,
  createPurchaseOrder,
  verifyPaymentSignature,
  verifySubscriptionSignature,
  verifyWebhookSignature,
  fetchPaymentDetails,
  fetchOrderDetails
}
