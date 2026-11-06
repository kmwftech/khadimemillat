import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { SadqaSubscriptionService } from '@/lib/services/sadqa-subscription.service'
import { razorpayService } from '@/lib/services/razorpay.service'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      subscriptionId, 
      razorpay_payment_id, 
      razorpay_subscription_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = body

    // Validation
    if (!subscriptionId || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      )
    }

    // Verify payment signature
    let isValidSignature = false
    if (razorpay_subscription_id) {
      isValidSignature = razorpayService.verifySubscriptionSignature({
        subscriptionId: razorpay_subscription_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      })
    } else if (razorpay_order_id) {
      isValidSignature = razorpayService.verifyPaymentSignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      })
    }

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    console.log('[COMPLETING_SUBSCRIPTION]', { 
      subscriptionId, 
      razorpay_subscription_id, 
      razorpay_order_id, 
      razorpay_payment_id 
    })

    // Complete subscription setup
    const result = await SadqaSubscriptionService.completeSubscriptionAfterPayment({
      subscriptionId,
      razorpaySubscriptionId: razorpay_subscription_id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    })

    console.log('[COMPLETION_RESULT]', result)

    if (!result.success) {
      console.error('[COMPLETION_FAILED]', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      message: 'Subscription activated successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Error completing subscription payment:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to complete subscription payment' 
      },
      { status: 500 }
    )
  }
}