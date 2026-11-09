import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sponsorship from '@/models/Sponsorship';
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

    // Process via RazorpaySubscriptionService
    await RazorpaySubscriptionService.processSponsorshipWebhook(event);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
