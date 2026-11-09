'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

interface DonationFormProps {
  campaignSlug: string
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000]

export default function DonationForm({ campaignSlug }: DonationFormProps) {
  const { user, isLoaded } = useUser()
  const [amount, setAmount] = useState<number | ''>('')
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [razorpayReady, setRazorpayReady] = useState(false)
  const [emailGenerated, setEmailGenerated] = useState(false)
  
  // 80G Receipt and preferences state
  const [wants80GReceipt, setWants80GReceipt] = useState(false)
  const [donorPAN, setDonorPAN] = useState('')
  const [donorAddress, setDonorAddress] = useState('')
  const [donorCity, setDonorCity] = useState('')
  const [donorState, setDonorState] = useState('')
  const [donorPincode, setDonorPincode] = useState('')
  const [receiptViaEmail, setReceiptViaEmail] = useState(true)
  const [receiptViaSMS, setReceiptViaSMS] = useState(true)
  const [razorpayManagedReceipt, setRazorpayManagedReceipt] = useState(true)
  
  // Recurring donation state
  const [makeRecurring, setMakeRecurring] = useState(false)

  // Auto-populate user data when logged in
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    // Always populate from Clerk data
    const clerkName = user.fullName || ''
    const clerkEmail = user.primaryEmailAddress?.emailAddress || ''
    const clerkPhone = user.primaryPhoneNumber?.phoneNumber || ''
    
    setDonorName(clerkName)
    setDonorEmail(clerkEmail)
    if (clerkPhone) {
      setDonorPhone(clerkPhone)
    }
    
    // Fetch complete user profile from API
    const loadUserProfile = async () => {
      try {
        const res = await fetch('/api/protected/users?self=1', { cache: 'no-store' })
        const ct = res.headers.get('content-type') || ''
        
        if (!res.ok || !ct.includes('application/json')) {
          return
        }
        
        const json = await res.json()
        
        if (json.users && json.users.length) {
          const u = json.users[0]
          
          // Populate phone and address data from API
          if (u.phone) {
            setDonorPhone(u.phone)
          }
          if (u.address) {
            setDonorAddress(u.address)
          }
          if (u.city) {
            setDonorCity(u.city)
          }
          if (u.state) {
            setDonorState(u.state)
          }
          if (u.pincode) {
            setDonorPincode(u.pincode)
          }
        }
      } catch (e) {
        // Silently handle profile fetch errors
      }
    }
    
    loadUserProfile()
  }, [isLoaded, user?.id])



  // Load Razorpay script
  useEffect(() => {
    const existing = document?.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement | null
    if (existing) {
      if ((window as any).Razorpay) setRazorpayReady(true)
      else existing.addEventListener('load', () => setRazorpayReady(true))
      return
    }
    const script = document?.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayReady(true)
    script.onerror = () => {
      setRazorpayReady(false)
    }
    document?.body.appendChild(script)
  }, [])

  // Generate dynamic email for logged out users based on name and phone
  const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)
  const generateDynamicEmail = (name: string, phone: string) => {
    let username = ''
    if (name.trim()) {
      username = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    }
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[^0-9]/g, '')
      username = username ? `${username}${cleanPhone.slice(-4)}` : cleanPhone.slice(-4)
    }
    const host = typeof window !== 'undefined' ? window.location.host.replace('www.', '') : 'khadimemillat.org'
    const candidate = username ? `${username}@${host}` : ''
    if (candidate && isValidEmail(candidate)) return candidate
    return `donor-${Date.now()}@khadimemillat.org`
  }

  const handlePresetAmount = (presetAmount: number) => {
    setAmount(presetAmount)
    setCustomAmount(presetAmount.toString())
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue)
    } else {
      setAmount('')
    }
  }

  const handleNameChange = (name: string) => {
    setDonorName(name)

    // Don't auto-generate email anymore since it's optional
  }

  const handlePhoneChange = (phone: string) => {
    setDonorPhone(phone)

    // Don't auto-generate email anymore since it's optional
  }

  const handleEmailChange = (email: string) => {
    setDonorEmail(email)
    setEmailGenerated(false) // User is manually editing email
  }

  // PAN validation helper
  const isValidPAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount')
      return
    }

    if (!donorName.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (!donorPhone.trim()) {
      toast.error('Please enter your phone number')
      return
    }

    // Email is optional, but if provided, must be valid
    if (donorEmail.trim() && !isValidEmail(donorEmail.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!donorPhone.trim()) {
      toast.error('Please enter your phone number')
      return
    }

    // Validate 80G receipt requirements
    if (wants80GReceipt) {
      if (!donorPAN.trim()) {
        toast.error('PAN number is required for 80G tax exemption receipt')
        return
      }
      if (!isValidPAN(donorPAN.trim().toUpperCase())) {
        toast.error('Please enter a valid PAN number (e.g., ABCDE1234F)')
        return
      }
      if (!donorAddress.trim()) {
        toast.error('Address is required for 80G tax exemption receipt')
        return
      }
      if (!donorCity.trim()) {
        toast.error('City is required for 80G tax exemption receipt')
        return
      }
      if (!donorState.trim()) {
        toast.error('State is required for 80G tax exemption receipt')
        return
      }
      if (!donorPincode.trim() || !/^[0-9]{6}$/.test(donorPincode.trim())) {
        toast.error('Valid 6-digit pincode is required for 80G tax exemption receipt')
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Update user profile if logged in and details have changed
      if (user) {
        const updateData: any = {}
        
        // Check if profile fields have been modified
        if (donorPhone.trim()) {
          const { normalizePhoneNumber } = await import('@/lib/utils/phone')
          updateData.phone = normalizePhoneNumber(donorPhone.trim())
        }
        if (donorAddress.trim()) updateData.address = donorAddress.trim()
        if (donorCity.trim()) updateData.city = donorCity.trim()
        if (donorState.trim()) updateData.state = donorState.trim()
        if (donorPincode.trim()) updateData.pincode = donorPincode.trim()
        
        // Update profile if there are changes
        if (Object.keys(updateData).length > 0) {
          try {
            await fetch('/api/protected/users/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateData)
            })
          } catch (profileError) {
            // Don't fail donation if profile update fails
          }
        }
      }

      const response = await fetch(`/api/public/programs/${campaignSlug}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim() || undefined,
          donorPhone: donorPhone.trim(),
          amount,
          message: message.trim() || undefined,
          wants80GReceipt,
          donorPAN: wants80GReceipt ? donorPAN.trim().toUpperCase() : undefined,
          donorAddress: wants80GReceipt ? donorAddress.trim() : undefined,
          donorCity: wants80GReceipt ? donorCity.trim() : undefined,
          donorState: wants80GReceipt ? donorState.trim() : undefined,
          donorPincode: wants80GReceipt ? donorPincode.trim() : undefined,
          receiptPreferences: {
            email: receiptViaEmail,
            sms: receiptViaSMS,
            razorpayManaged: razorpayManagedReceipt
          },
          paymentMethod: 'online'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        let errorMessage = errorData.error || 'Failed to submit donation'
        
        // Provide more specific error messages
        if (errorMessage.includes('Missing required fields')) {
          errorMessage = 'Please fill in all required fields: Name, Phone Number, and Amount'
        } else if (errorMessage.includes('PAN number')) {
          errorMessage = 'Valid PAN number is required for 80G receipt (format: ABCDE1234F)'
        } else if (errorMessage.includes('Complete address')) {
          errorMessage = 'Complete address (Address, City, State, Pincode) is required for 80G receipt'
        }
        
        throw new Error(errorMessage)
      }

      const donation = await response.json()

      // Create Razorpay order
      if (!razorpayReady) throw new Error('Payment gateway is not ready. Please try again.')
      
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'donation', 
          amount, 
          referenceId: donation.donationId || donation._id, 
          email: donorEmail.trim() || undefined, 
          phone: donorPhone.trim(),
          receiptPreferences: {
            email: receiptViaEmail,
            sms: receiptViaSMS,
            razorpayManaged: razorpayManagedReceipt
          }
        })
      })
      
      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({ error: 'Unknown payment error' }))
        
        let errorMessage = errorData.error || 'Failed to create payment order'
        
        // Provide user-friendly error messages
        if (errorMessage.includes('required fields')) {
          errorMessage = 'Missing required information for payment. Please check all fields are filled.'
        } else if (errorMessage.includes('amount')) {
          errorMessage = 'Invalid donation amount. Please enter a valid amount.'
        } else if (errorMessage.includes('Reference ID')) {
          errorMessage = 'Donation record error. Please try submitting again.'
        }
        
        throw new Error(errorMessage)
      }
      const { orderId, amount: amtPaise, currency, keyId } = await orderRes.json()

      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount: amtPaise,
        currency,
        name: 'Khadim-e-Millat Welfare Foundation',
        description: `Donation for ${campaignSlug}`,
        order_id: orderId,
        prefill: { name: donorName, email: donorEmail, contact: donorPhone },
        theme: { color: '#16a34a' },
        handler: async (resp: any) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'donation', 
                orderId: resp.razorpay_order_id, 
                paymentId: resp.razorpay_payment_id, 
                signature: resp.razorpay_signature, 
                referenceId: donation.donationId || donation._id
              })
            })
            if (verifyRes.status === 202) {
              toast.info('Payment received. Verification is pending; you will receive a confirmation shortly.')
              // Redirect to thank you page even for pending status
              toast.loading('Redirecting to confirmation page...', { id: 'redirect-loading' })
              setTimeout(() => {
                window.location.href = `/thank-you?donationId=${donation.donationId || donation._id}&paymentId=${resp.razorpay_payment_id}`
              }, 2000)
              return
            }
            if (!verifyRes.ok) {
              const data = await verifyRes.json().catch(() => ({}))
              throw new Error(data.error || 'Payment verification failed')
            }
            
            // Success! Check if recurring subscription should be set up
            if (makeRecurring && campaignSlug === 'sadqa') {
              toast.success('Donation completed! Setting up your recurring subscription...')
              toast.loading('Redirecting to subscription setup...', { id: 'redirect-loading' })
              setTimeout(() => {
                window.location.href = `/sadqa-subscription?amount=${amount}&redirect=donate`
              }, 1500)
            } else {
              // Regular success redirect
              toast.success('Donation completed successfully! Thank you for your support.')
              toast.loading('Redirecting to confirmation page...', { id: 'redirect-loading' })
              setTimeout(() => {
                window.location.href = `/thank-you?donationId=${donation.donationId || donation._id}&paymentId=${resp.razorpay_payment_id}`
              }, 1500)
            }
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Payment verification failed')
          }
        }
      })
      rzp.on('payment.failed', (resp: any) => {
        toast.error(resp.error?.description || 'Payment failed. Please try again.')
      })
      rzp.open()

      // In production, webhook also confirms payment

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit donation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPresetSelected = (presetAmount: number) => amount === presetAmount

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Preset Amounts */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-3 block">
          Choose Amount (₹)
        </Label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {PRESET_AMOUNTS.map((presetAmount) => (
            <Button
              key={presetAmount}
              type="button"
              variant={isPresetSelected(presetAmount) ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetAmount(presetAmount)}
              className="text-sm"
            >
              ₹{presetAmount.toLocaleString()}
            </Button>
          ))}
        </div>

        {/* Custom Amount */}
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Enter custom amount"
          value={customAmount}
          onChange={(e) => handleCustomAmount(e.target.value)}
          min={1}
          className="text-sm"
        />
      </div>

      {/* Donor Information */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="donorName" className="text-sm font-medium text-foreground">
            Your Name *
          </Label>
          <Input
            id="donorName"
            type="text"
            value={donorName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your full name"
            required
            className="text-sm"
          />
        </div>

        {/* Phone Number Field - Always shown */}
        <div>
          <Label htmlFor="donorPhone" className="text-sm font-medium text-foreground">
            Phone Number *
          </Label>
          <PhoneInput
            id="donorPhone"
            value={donorPhone}
            onChange={(value) => handlePhoneChange(value)}
            placeholder="Enter your phone number"
            required
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="donorEmail" className="text-sm font-medium text-foreground">
            Email <span className="text-muted-foreground">(optional)</span>
            {!user && (
              <span className="text-xs text-muted-foreground ml-1">
                (Required for all donations)
              </span>
            )}
          </Label>
          <Input
            id="donorEmail"
            type="email"
            value={donorEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder={user ? "Your email (optional)" : "Enter your email (optional)"}
            className="text-sm"
          />
          {!user && emailGenerated && (
            <p className="text-xs text-muted-foreground mt-1">
              Auto-generated from name and phone. You can edit this if needed.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium text-foreground">
            Message (Optional)
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message of support..."
            rows={3}
            className="text-sm resize-none"
          />
        </div>
      </div>

      {/* Recurring Donation Option - Only for Sadqa */}
      {campaignSlug === 'sadqa' && (
        <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <input
              id="makeRecurring"
              type="checkbox"
              checked={makeRecurring}
              onChange={(e) => setMakeRecurring(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="makeRecurring" className="text-sm font-medium">
              Make this a recurring donation
            </Label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            Set up automatic monthly donations to make charity a habit. You can manage or cancel anytime.
          </p>
          {makeRecurring && (
            <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded border">
              <p className="text-sm text-muted-foreground">
                You'll be redirected to set up your recurring subscription after this donation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 80G Receipt and Preferences Section (Disabled per requirements) */}
      {/* 
      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Receipt Preferences</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="wants80GReceipt"
                type="checkbox"
                checked={wants80GReceipt}
                onChange={(e) => setWants80GReceipt(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="wants80GReceipt" className="text-sm font-medium">
                I want 80G tax exemption certificate
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Get tax benefits under Section 80G of Income Tax Act. PAN number required.
            </p>
          </div>

          {wants80GReceipt && (
            <>
              <div>
                <Label htmlFor="donorPAN" className="text-sm font-medium text-foreground">
                  PAN Number *
                </Label>
                <Input
                  id="donorPAN"
                  type="text"
                  value={donorPAN}
                  onChange={(e) => setDonorPAN(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  required={wants80GReceipt}
                  maxLength={10}
                  className="text-sm uppercase"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for 80G certificate. Format: ABCDE1234F
                </p>
              </div>

              <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Address Details (Required for 80G Certificate)</h4>
                
                <div>
                  <Label htmlFor="donorAddress" className="text-sm font-medium text-foreground">
                    Address *
                  </Label>
                  <Input
                    id="donorAddress"
                    type="text"
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    required={wants80GReceipt}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="donorCity" className="text-sm font-medium text-foreground">
                      City *
                    </Label>
                    <Input
                      id="donorCity"
                      type="text"
                      value={donorCity}
                      onChange={(e) => setDonorCity(e.target.value)}
                      placeholder="City"
                      required={wants80GReceipt}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="donorPincode" className="text-sm font-medium text-foreground">
                      Pincode *
                    </Label>
                    <Input
                      id="donorPincode"
                      type="text"
                      value={donorPincode}
                      onChange={(e) => setDonorPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      required={wants80GReceipt}
                      maxLength={6}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="donorState" className="text-sm font-medium text-foreground">
                    State *
                  </Label>
                  <Input
                    id="donorState"
                    type="text"
                    value={donorState}
                    onChange={(e) => setDonorState(e.target.value)}
                    placeholder="State"
                    required={wants80GReceipt}
                    className="text-sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      */}



      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !amount || !donorName.trim()}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4" />
            Proceed to Payment ₹{amount ? amount.toLocaleString() : '0'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        You will be redirected to Razorpay secure payment gateway to complete your donation.
        {!user && " No account creation required."}
      </p>
    </form>
  )
}