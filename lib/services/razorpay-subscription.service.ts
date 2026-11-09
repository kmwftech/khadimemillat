import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import Sponsorship from '@/models/Sponsorship';
import SponsorshipPayment from '@/models/SponsorshipPayment';
import FamilyMember from '@/models/FamilyMember';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class RazorpaySubscriptionService {
  
  /**
   * Create a subscription plan for sponsorship
   */
  static async createPlan(amount: number, categoryName: string) {
    try {
      const plan = await razorpay.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: `Sponsorship - ${categoryName}`,
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          description: `Monthly sponsorship for ${categoryName} category`
        },
        notes: {
          category: categoryName,
          type: 'sponsorship'
        }
      });
      
      return {
        success: true,
        planId: plan.id,
        plan
      };
    } catch (error) {
      console.error('Error creating Razorpay plan:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create plan'
      };
    }
  }

  /**
   * Create a customer for the sponsor
   */
  static async createCustomer(sponsorData: {
    name: string;
    email: string;
    phone?: string;
  }) {
    try {
      const customer = await razorpay.customers.create({
        name: sponsorData.name,
        email: sponsorData.email,
        contact: sponsorData.phone,
        notes: {
          type: 'sponsor'
        }
      });
      
      return {
        success: true,
        customerId: customer.id,
        customer
      };
    } catch (error) {
      console.error('Error creating Razorpay customer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer'
      };
    }
  }

  /**
   * Create a subscription for the sponsor
   */
  static async createSubscription(data: {
    planId: string;
    customerId?: string;
    totalCount?: number;
    startAt?: number;
    notes?: Record<string, string>;
  }) {
    try {
      const subscriptionData: any = {
        plan_id: data.planId,
        total_count: data.totalCount || 12, // Default 12 months
        quantity: 1,
        notes: {
          type: 'sponsorship',
          ...data.notes
        }
      };

      if (data.customerId) {
        subscriptionData.customer_id = data.customerId;
      }

      if (data.startAt) {
        subscriptionData.start_at = data.startAt;
      }

      const subscription = await razorpay.subscriptions.create(subscriptionData);
      
      return {
        success: true,
        subscriptionId: subscription.id,
        subscription
      };
    } catch (error) {
      console.error('Error creating Razorpay subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subscription'
      };
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      
      return {
        success: true,
        subscription
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscription'
      };
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string, cancelAtCycleEnd = false) {
    try {
      const subscription = await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
      
      return {
        success: true,
        subscription
      };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel subscription'
      };
    }
  }

  /**
   * Pause a subscription
   */
  static async pauseSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.pause(subscriptionId);
      
      return {
        success: true,
        subscription
      };
    } catch (error) {
      console.error('Error pausing subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to pause subscription'
      };
    }
  }

  /**
   * Resume a subscription
   */
  static async resumeSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.resume(subscriptionId);
      
      return {
        success: true,
        subscription
      };
    } catch (error) {
      console.error('Error resuming subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resume subscription'
      };
    }
  }

  /**
   * Get all payments for a subscription
   */
  static async getSubscriptionPayments(subscriptionId: string) {
    try {
      // Get subscription details first
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      
      // Get all payments and filter by subscription
      const allPayments = await razorpay.payments.all({
        count: 100 // Adjust as needed
      });
      
      // Filter payments for this subscription (if needed)
      const subscriptionPayments = allPayments.items || [];
      
      return {
        success: true,
        payments: subscriptionPayments,
        subscription
      };
    } catch (error) {
      console.error('Error fetching subscription payments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payments'
      };
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      
      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Process sponsorship subscription webhook events
   */
  static async processSponsorshipWebhook(event: any) {
    await connectDB();
    const eventName = event.event;
    const payload = event.payload;

    switch (eventName) {
      case 'subscription.authenticated':
      case 'subscription.activated':
        if (payload?.subscription?.entity) {
          await this.handleSubscriptionActivated(payload.subscription.entity);
        }
        break;

      case 'subscription.charged':
        if (payload?.payment?.entity && payload?.subscription?.entity) {
          await this.handleSubscriptionCharged(payload.payment.entity, payload.subscription.entity);
          await this.handleFirstPayment(payload.subscription.entity);
        }
        break;

      case 'subscription.cancelled':
        if (payload?.subscription?.entity) {
          await this.handleSubscriptionCancelled(payload.subscription.entity);
        }
        break;

      case 'subscription.paused':
        if (payload?.subscription?.entity) {
          await this.handleSubscriptionPaused(payload.subscription.entity);
        }
        break;

      case 'subscription.resumed':
        if (payload?.subscription?.entity) {
          await this.handleSubscriptionResumed(payload.subscription.entity);
        }
        break;

      case 'payment.failed':
        if (payload?.payment?.entity) {
          await this.handlePaymentFailed(payload.payment.entity);
        }
        break;

      default:
        console.log('[SPONSORSHIP_WEBHOOK_UNHANDLED_EVENT]', eventName);
    }
  }

  static async handleSubscriptionActivated(subscription: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: subscription.id 
      });

      if (sponsorship) {
        sponsorship.status = 'active';
        if (subscription.current_end) {
          sponsorship.nextPaymentDate = new Date(subscription.current_end * 1000);
        }
        await sponsorship.save();
        console.log('[SPONSORSHIP_ACTIVATED]', subscription.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_ACTIVATION_ERROR]', error);
    }
  }

  static async handleSubscriptionCharged(payment: any, subscription: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: subscription.id 
      });

      if (sponsorship) {
        const sponsorshipPayment = new SponsorshipPayment({
          sponsorshipId: sponsorship._id,
          sponsorId: sponsorship.sponsorId,
          beneficiaryId: sponsorship.beneficiaryId,
          amount: payment.amount / 100,
          razorpayPaymentId: payment.id,
          razorpaySubscriptionId: subscription.id,
          status: 'paid',
          paymentDate: new Date(payment.created_at * 1000),
          dueDate: new Date(subscription.current_start * 1000),
          paidAt: new Date(payment.created_at * 1000),
          paymentMethod: payment.method
        });

        await sponsorshipPayment.save();

        sponsorship.totalPaid += payment.amount / 100;
        sponsorship.paymentCount += 1;
        sponsorship.lastPaymentDate = new Date(payment.created_at * 1000);
        if (subscription.current_end) {
          sponsorship.nextPaymentDate = new Date(subscription.current_end * 1000);
        }
        await sponsorship.save();

        console.log('[SPONSORSHIP_PAYMENT_RECORDED]', payment.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_CHARGE_ERROR]', error);
    }
  }

  static async handleSubscriptionCancelled(subscription: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: subscription.id 
      });

      if (sponsorship) {
        sponsorship.status = 'cancelled';
        sponsorship.endDate = new Date();
        await sponsorship.save();

        await FamilyMember.findByIdAndUpdate(sponsorship.beneficiaryId, {
          'sponsorship.isSponsored': false,
          'sponsorship.sponsoredAt': null,
          'sponsorship.sponsorId': null
        });

        console.log('[SPONSORSHIP_CANCELLED]', subscription.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_CANCEL_ERROR]', error);
    }
  }

  static async handleSubscriptionPaused(subscription: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: subscription.id 
      });

      if (sponsorship) {
        sponsorship.status = 'paused';
        await sponsorship.save();
        console.log('[SPONSORSHIP_PAUSED]', subscription.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_PAUSE_ERROR]', error);
    }
  }

  static async handleSubscriptionResumed(subscription: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: subscription.id 
      });

      if (sponsorship) {
        sponsorship.status = 'active';
        if (subscription.current_end) {
          sponsorship.nextPaymentDate = new Date(subscription.current_end * 1000);
        }
        await sponsorship.save();
        console.log('[SPONSORSHIP_RESUMED]', subscription.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_RESUME_ERROR]', error);
    }
  }

  static async handleFirstPayment(subscription: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: subscription.id 
      });

      if (sponsorship && sponsorship.paymentCount === 1) {
        await FamilyMember.findByIdAndUpdate(sponsorship.beneficiaryId, {
          'sponsorship.isSponsored': true,
          'sponsorship.sponsoredAt': new Date(),
          'sponsorship.sponsorId': sponsorship.sponsorId
        });

        console.log('[SPONSORSHIP_FIRST_PAYMENT_PROCESSED]', subscription.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_FIRST_PAYMENT_ERROR]', error);
    }
  }

  static async handlePaymentFailed(payment: any) {
    try {
      const sponsorship = await Sponsorship.findOne({ 
        razorpaySubscriptionId: payment.subscription_id 
      });

      if (sponsorship) {
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
        console.log('[SPONSORSHIP_PAYMENT_FAILED_RECORDED]', payment.id);
      }
    } catch (error) {
      console.error('[SPONSORSHIP_PAYMENT_FAILED_ERROR]', error);
    }
  }
}