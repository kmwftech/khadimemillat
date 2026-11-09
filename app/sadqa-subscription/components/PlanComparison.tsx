'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  Award, 
  Check, 
  Loader2,
  Heart,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Plan {
  _id: string
  planType: 'daily' | 'weekly' | 'monthly' | 'yearly'
  displayName: string
  description: string
  minAmount: number
  maxAmount: number
  suggestedAmount: number
  intervalCount: number
  intervalUnit: string
  isActive: boolean
  displayOrder: number
}

const planIcons = {
  daily: Clock,
  weekly: Calendar,
  monthly: CreditCard,
  yearly: Award
}

const planColors = {
  daily: 'from-blue-500 to-cyan-500',
  weekly: 'from-green-500 to-emerald-500',
  monthly: 'from-purple-500 to-pink-500',
  yearly: 'from-orange-500 to-red-500'
}

const planFeatures = {
  daily: [
    'Build a daily giving habit',
    'Small, manageable amounts',
    'Immediate impact tracking',
    'Flexible pause/resume'
  ],
  weekly: [
    'Friday (Juma) giving tradition',
    'Weekly impact reports',
    'Balanced commitment',
    'Community recognition'
  ],
  monthly: [
    'Most popular choice',
    'Significant monthly impact',
    'Detailed progress reports',
    'Priority support'
  ],
  yearly: [
    'Maximum impact potential',
    // 'Annual tax planning',
    'Exclusive updates',
    'VIP donor status'
  ]
}

const planBenefits = {
  daily: { habit: true, flexibility: true, impact: 'Immediate', commitment: 'Low' },
  weekly: { habit: true, flexibility: true, impact: 'Weekly', commitment: 'Medium' },
  monthly: { habit: true, flexibility: true, impact: 'Significant', commitment: 'Medium' },
  yearly: { habit: true, flexibility: false, impact: 'Maximum', commitment: 'High' }
}

export default function PlanComparison() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/sadqa-subscription/plans')
      const data = await response.json()
      
      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error('Failed to load subscription plans')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to load subscription plans')
    } finally {
      setLoading(false)
    }
  }

  const calculateYearlyEquivalent = (plan: Plan) => {
    switch (plan.planType) {
      case 'daily': return plan.suggestedAmount * 365
      case 'weekly': return plan.suggestedAmount * 52
      case 'monthly': return plan.suggestedAmount * 12
      case 'yearly': return plan.suggestedAmount
      default: return 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading subscription plans...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = planIcons[plan.planType]
          const features = planFeatures[plan.planType]
          const benefits = planBenefits[plan.planType]
          const isPopular = plan.planType === 'monthly'
          
          return (
            <Card 
              key={plan._id} 
              className={`relative ${isPopular ? 'ring-2 ring-primary shadow-lg' : ''}`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${planColors[plan.planType]} flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{plan.displayName}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    ₹{plan.minAmount} - ₹{plan.maxAmount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Suggested: ₹{plan.suggestedAmount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ~₹{Math.round(calculateYearlyEquivalent(plan)).toLocaleString()} yearly
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Benefits */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="font-medium">{benefits.impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commitment:</span>
                    <span className="font-medium">{benefits.commitment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flexibility:</span>
                    <span className="font-medium">{benefits.flexibility ? 'High' : 'Medium'}</span>
                  </div>
                </div>

                <Button 
                  asChild
                  variant={isPopular ? "default" : "outline"} 
                  className="w-full"
                >
                  <Link href={`/sadqa-subscription?planType=${plan.planType}&amount=${plan.suggestedAmount}`}>
                    Choose {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  {plans.map(plan => (
                    <th key={plan._id} className="text-center py-3 px-4">
                      {plan.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Payment Frequency</td>
                  {plans.map(plan => (
                    <td key={plan._id} className="text-center py-3 px-4 capitalize">
                      {plan.planType}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Amount Range</td>
                  {plans.map(plan => (
                    <td key={plan._id} className="text-center py-3 px-4">
                      ₹{plan.minAmount} - ₹{plan.maxAmount}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Yearly Equivalent</td>
                  {plans.map(plan => (
                    <td key={plan._id} className="text-center py-3 px-4">
                      ₹{Math.round(calculateYearlyEquivalent(plan)).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Habit Building</td>
                  {plans.map(plan => (
                    <td key={plan._id} className="text-center py-3 px-4">
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Pause/Resume</td>
                  {plans.map(plan => (
                    <td key={plan._id} className="text-center py-3 px-4">
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Impact Reports</td>
                  {plans.map(plan => (
                    <td key={plan._id} className="text-center py-3 px-4">
                      {plan.planType === 'yearly' ? (
                        <div className="flex items-center justify-center gap-1">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-xs">Detailed</span>
                        </div>
                      ) : (
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Can I change my plan later?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, you can cancel your current subscription and create a new one with a different plan anytime.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What happens if a payment fails?</h4>
            <p className="text-muted-foreground text-sm">
              We'll retry the payment 3 times over 7 days. If all attempts fail, your subscription will be paused and you'll be notified.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Are there any setup fees?</h4>
            <p className="text-muted-foreground text-sm">
              No, there are no setup fees or hidden charges. You only pay the amount you choose for your donations.
            </p>
          </div>
          {/* <div>
            <h4 className="font-semibold mb-2">Can I get tax benefits?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, all donations are eligible for 80G tax deduction. We'll provide certificates for your tax filing.
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}