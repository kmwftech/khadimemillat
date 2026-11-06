import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import connectDB from '@/lib/db'
import SadqaSubscription from '@/models/SadqaSubscription'
import SadqaSubscriptionPlan from '@/models/SadqaSubscriptionPlan'
import User from '@/models/User'
import { SadqaSubscriptionService } from '@/lib/services/sadqa-subscription.service'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { planType, amount, startDate } = body

    // Validation
    if (!planType || !amount) {
      return NextResponse.json(
        { error: 'Plan type and amount are required' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if plan exists and is active
    const plan = await SadqaSubscriptionPlan.findOne({ 
      planType, 
      isActive: true 
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid or inactive subscription plan' },
        { status: 400 }
      )
    }

    // Validate amount against plan limits (only check maximum)
    if (amount > plan.maxAmount) {
      return NextResponse.json(
        { 
          error: `Amount must not exceed ₹${plan.maxAmount} for ${plan.displayName} plan` 
        },
        { status: 400 }
      )
    }

    // Check subscription limits (max 3 active subscriptions per user)
    const activeSubscriptionsCount = await SadqaSubscription.countDocuments({
      clerkUserId: userId,
      status: 'active'
    })

    if (activeSubscriptionsCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 active subscriptions allowed per user' },
        { status: 400 }
      )
    }

    // Create subscription using service
    const result = await SadqaSubscriptionService.createSubscription({
      clerkUserId: userId,
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      userName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'Anonymous',
      userPhone: user.phoneNumbers[0]?.phoneNumber,
      planType,
      amount,
      startDate: startDate ? new Date(startDate) : undefined
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      subscriptionId: result.subscriptionId,
      razorpayKeyId: result.razorpayKeyId,
      message: 'Subscription created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create subscription' 
      },
      { status: 500 }
    )
  }
}