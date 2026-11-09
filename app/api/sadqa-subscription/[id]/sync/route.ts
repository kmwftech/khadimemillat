import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/db'
import SadqaSubscription from '@/models/SadqaSubscription'
import { SadqaSubscriptionService } from '@/lib/services/sadqa-subscription.service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    await connectDB()

    const subscription = await SadqaSubscription.findById(id)
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Sync with Razorpay
    const result = await SadqaSubscriptionService.syncSubscriptionStatus(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      statusChanged: result.statusChanged
    })
  } catch (error) {
    console.error('Error syncing subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync subscription' },
      { status: 500 }
    )
  }
}

