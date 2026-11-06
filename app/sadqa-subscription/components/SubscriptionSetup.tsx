'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Heart, Calendar, CreditCard, CheckCircle, Database } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import PlanSelector from './PlanSelector'

const subscriptionSchema = z.object({
  planType: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  startDate: z.date().optional()
})

type SubscriptionFormData = z.infer<typeof subscriptionSchema>

interface SubscriptionSetupProps {
  prefilledAmount?: number
  redirectSource?: string
}

export default function SubscriptionSetup({ prefilledAmount, redirectSource }: SubscriptionSetupProps) {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [plansLoading, setPlansLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      amount: prefilledAmount || 0
    }
  })

  const watchedAmount = watch('amount')
  const watchedPlanType = watch('planType')

  // Fetch subscription plans
  useEffect(() => {
    fetchPlans()
  }, [])

  // Set prefilled amount when plan is selected
  useEffect(() => {
    if (selectedPlan && prefilledAmount) {
      if (prefilledAmount >= selectedPlan.minAmount && prefilledAmount <= selectedPlan.maxAmount) {
        setValue('amount', prefilledAmount)
      } else {
        setValue('amount', selectedPlan.suggestedAmount)
      }
    }
  }, [selectedPlan, prefilledAmount, setValue])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/sadqa-subscription/plans')
      const data = await response.json()
      
      if (data.success) {
        setPlans(data.plans)
        // Auto-select monthly plan if coming from donation page
        if (redirectSource === 'donate' && data.plans.length > 0) {
          const monthlyPlan = data.plans.find((p: any) => p.planType === 'monthly')
          if (monthlyPlan) {
            handlePlanSelect(monthlyPlan)
          }
        }
      } else {
        toast.error('Failed to load subscription plans')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to load subscription plans')
    } finally {
      setPlansLoading(false)
    }
  }

  const handleSeedPlans = async () => {
    setSeeding(true)
    
    try {
      const response = await fetch('/api/sadqa-subscription/plans/seed', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Default subscription plans created successfully!')
        // Refresh plans
        await fetchPlans()
      } else {
        toast.error(data.error || 'Failed to create default plans')
      }
    } catch (error) {
      console.error('Error seeding plans:', error)
      toast.error('Failed to create default plans')
    } finally {
      setSeeding(false)
    }
  }

  // Check if user is admin or moderator
  const isAdminOrModerator = () => {
    const userRole = user?.publicMetadata?.role as string
    return userRole === 'admin' || userRole === 'moderator'
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan)
    setValue('planType', plan.planType)
    if (!watchedAmount || watchedAmount < plan.minAmount || watchedAmount > plan.maxAmount) {
      setValue('amount', prefilledAmount && prefilledAmount >= plan.minAmount && prefilledAmount <= plan.maxAmount 
        ? prefilledAmount 
        : plan.suggestedAmount)
    }
    setStep(2)
  }

  const handleAmountChange = (amount: number) => {
    if (selectedPlan && amount >= selectedPlan.minAmount && amount <= selectedPlan.maxAmount) {
      setValue('amount', amount)
    }
  }

  const onSubmit = async (data: SubscriptionFormData) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/sadqa-subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        if (result.subscriptionId || result.order) {
          // Initialize Razorpay payment
          await initiateRazorpayPayment(result)
        } else {
          toast.success('Subscription created successfully!')
          router.push(`/sadqa-subscription/success?id=${result.subscription._id}`)
        }
      } else {
        toast.error(result.error || 'Failed to create subscription')
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      toast.error('Failed to create subscription')
    } finally {
      setLoading(false)
    }
  }

  const initiateRazorpayPayment = async (orderData: any) => {
    try {
      const openCheckout = () => {
        const subscriptionId = orderData.subscriptionId || orderData.subscription?.razorpaySubscriptionId

        const options: any = {
          key: orderData.razorpayKeyId,
          name: 'Khadim-Millat Welfare Foundation',
          description: `${selectedPlan?.displayName || 'Sadqa'} Subscription`,
          handler: async (response: any) => {
            await handlePaymentSuccess(response, orderData.subscription._id)
          },
          prefill: {
            name: orderData.subscription.userName,
            email: orderData.subscription.userEmail,
            contact: orderData.subscription.userPhone
          },
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: () => {
              setLoading(false)
              toast.error('Payment cancelled')
            }
          }
        }

        if (subscriptionId) {
          options.subscription_id = subscriptionId
        } else if (orderData.order?.id) {
          options.order_id = orderData.order.id
          options.amount = orderData.order.amount
          options.currency = orderData.order.currency
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      }

      if ((window as any).Razorpay) {
        openCheckout()
      } else {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = openCheckout
        script.onerror = () => {
          setLoading(false)
          toast.error('Failed to load payment gateway')
        }
        document.body.appendChild(script)
      }
    } catch (error) {
      console.error('Error initiating payment:', error)
      setLoading(false)
      toast.error('Failed to initiate payment')
    }
  }

  const handlePaymentSuccess = async (paymentResponse: any, subscriptionId: string) => {
    try {
      const response = await fetch('/api/sadqa-subscription/complete-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_subscription_id: paymentResponse.razorpay_subscription_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('[PAYMENT_SUCCESS] Subscription completion result:', result)
        toast.success('Subscription activated successfully!')
        router.push(`/sadqa-subscription/success?id=${result.subscription._id}`)
      } else {
        console.error('[PAYMENT_COMPLETION_FAILED]', result.error)
        toast.error(result.error || 'Failed to activate subscription')
      }
    } catch (error) {
      console.error('Error completing subscription:', error)
      toast.error('Failed to complete subscription')
    } finally {
      setLoading(false)
    }
  }



  if (plansLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading subscription plans...</span>
      </div>
    )
  }

  // Show seeding option for admins/moderators when no plans exist
  if (plans.length === 0 && isAdminOrModerator()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            No Subscription Plans Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              No subscription plans are configured. As an admin/moderator, you can create the default plans to get started.
            </p>
          </div>
          <Button 
            onClick={handleSeedPlans}
            disabled={seeding}
            size="lg"
          >
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Plans...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Create Default Plans
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show message for regular users when no plans exist
  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Subscription Plans Not Available</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Subscription plans are currently being set up. Please check back later or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step > stepNum ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Plan Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Choose Your Giving Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlanSelector 
              plans={plans}
              onPlanSelect={handlePlanSelect}
              prefilledAmount={prefilledAmount}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Amount Customization */}
      {step === 2 && selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Customize Your Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                {selectedPlan.displayName}
              </Badge>
              <p className="text-muted-foreground">
                {selectedPlan.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={selectedPlan.minAmount}
                  max={selectedPlan.maxAmount}
                  {...register('amount', { valueAsNumber: true })}
                  className="text-lg font-medium"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Range: ₹{selectedPlan.minAmount} - ₹{selectedPlan.maxAmount}
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAmountChange(selectedPlan.minAmount)}
                >
                  ₹{selectedPlan.minAmount}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAmountChange(selectedPlan.suggestedAmount)}
                >
                  ₹{selectedPlan.suggestedAmount}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAmountChange(selectedPlan.maxAmount)}
                >
                  ₹{selectedPlan.maxAmount}
                </Button>
              </div>

              {/* Impact Preview */}
              {watchedAmount > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Your Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Your {selectedPlan.planType} contribution of ₹{watchedAmount} will help support our welfare programs continuously.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1"
              >
                Continue to Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review and Confirm */}
      {step === 3 && selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Review Your Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan:</span>
                  <Badge>{selectedPlan.displayName}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Amount:</span>
                  <span className="text-lg font-bold">₹{watchedAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Frequency:</span>
                  <span className="capitalize">{selectedPlan.planType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">First Payment:</span>
                  <span>Today</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Your subscription will be processed automatically</p>
                <p>• You can pause or cancel anytime from your dashboard</p>
                <p>• Receipts will be sent via email and SMS</p>
                <p>• All donations are eligible for 80G tax benefits</p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Subscription...
                    </>
                  ) : (
                    'Create Subscription'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}