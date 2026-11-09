'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Download, Share2, Printer, Mail, MessageSquare, Users, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface DonationThankYouProps {
  donationId: string
  donorName: string
  amount: number
  currency: string
  receiptId: string
  certificateNumber?: string
  wants80G: boolean
  campaignName?: string
  programName?: string
  donationDate: string
  razorpayPaymentId?: string
}

export default function DonationThankYou({
  donationId,
  donorName,
  amount,
  currency,
  receiptId,
  certificateNumber,
  wants80G,
  campaignName,
  programName,
  donationDate,
  razorpayPaymentId
}: DonationThankYouProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [showMembership, setShowMembership] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    // Check if user is eligible for membership prompt
    const checkMembershipEligibility = async () => {
      if (!user?.id) return

      try {
        // Check if user has any role in metadata (admin, moderator, member, etc.)
        const userRole = user.publicMetadata?.role
        
        // Show membership prompt only if user has no role (simple donor) and is logged in
        if (!userRole) {
          // Check if user already has a membership request
          const response = await fetch('/api/membership/request')
          if (response.status === 404) {
            // No existing request, show prompt
            setShowMembership(true)
          }
        }
      } catch (error) {
        // If API call fails, still show prompt for eligible users (no role)
        const userRole = user.publicMetadata?.role
        if (!userRole) {
          setShowMembership(true)
        }
      }
    }

    checkMembershipEligibility()
  }, [user])

  const handlePrint = () => {
    // Create a new window with only the receipt content
    const receiptContent = generateReceiptContent()
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (printWindow) {
      printWindow.document?.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Donation Receipt - ${receiptId}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
              }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document?.close()
    } else {
      // Fallback to regular print
      window.print()
    }
  }

  const handleDownload = async () => {
    try {
      toast.info('Generating receipt image...')

      // Download receipt image from server-side API (PNG only)
      const imageResponse = await fetch(`/api/receipts/${donationId}/image`)

      console.log('PNG endpoint response:', imageResponse.status, imageResponse.headers.get('content-type'))

      if (imageResponse.ok) {
        const blob = await imageResponse.blob()
        console.log('Downloaded blob type:', blob.type, 'size:', blob.size)

        const url = URL.createObjectURL(blob)
        const a = document?.createElement('a')
        a.href = url
        a.download = `donation-receipt-${receiptId}.png`
        document?.body.appendChild(a)
        a.click()
        document?.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success('Receipt downloaded successfully as PNG!')
      } else {
        // Fallback: Download HTML receipt
        const receiptContent = generateReceiptContent()
        const blob = new Blob([receiptContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document?.createElement('a')
        a.href = url
        a.download = `donation-receipt-${receiptId}.html`
        document?.body.appendChild(a)
        a.click()
        document?.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success('Receipt downloaded as HTML!')
      }
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download receipt')
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const shareText = `I just donated ${currency} ${amount.toLocaleString('en-IN')} to Khadim-e-Millat Welfare Foundation for ${programName}. Join me in supporting this noble cause!`

      // Generate receipt image via server-side API (PNG only)
      toast.info('Generating receipt image...')
      const imageResponse = await fetch(`/api/receipts/${donationId}/image`)

      console.log('PNG endpoint response:', imageResponse.status, imageResponse.headers.get('content-type'))

      if (imageResponse.ok) {
        const blob = await imageResponse.blob()
        console.log('Downloaded blob type:', blob.type, 'size:', blob.size)

        // Check if Web Share API is supported and can share files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'receipt.png')] })) {
          const file = new File([blob], `donation-receipt-${receiptId}.png`, { type: 'image/png' })
          await navigator.share({
            title: 'Donation Receipt - Khadim-e-Millat Welfare Foundation',
            text: shareText,
            files: [file]
          })
          toast.success(`Receipt shared successfully as PNG!`)
        } else {
          // Fallback: Download the image and share text
          const url = URL.createObjectURL(blob)
          const a = document?.createElement('a')
          a.href = url
          a.download = `donation-receipt-${receiptId}.png`
          document?.body.appendChild(a)
          a.click()
          document?.body.removeChild(a)
          URL.revokeObjectURL(url)

          // Try to share text if Web Share API supports it
          if (navigator.share) {
            await navigator.share({
              title: 'Donation Receipt - Khadim-e-Millat Welfare Foundation',
              text: shareText,
              url: window.location.origin
            })
          } else {
            // Final fallback: Copy to clipboard
            await navigator.clipboard.writeText(shareText + ` - ${window.location.origin}`)
            toast.success(`Receipt downloaded as PNG and text copied to clipboard!`)
          }
        }
      } else {
        // Fallback to text sharing only if image generation fails
        if (navigator.share) {
          await navigator.share({
            title: 'Donation to Khadim-e-Millat Welfare Foundation',
            text: shareText,
            url: window.location.origin
          })
        } else {
          await navigator.clipboard.writeText(shareText + ` - ${window.location.origin}`)
          toast.success('Share text copied to clipboard!')
        }
      }
    } catch (error) {
      console.error('Share failed:', error)
      toast.error('Failed to share receipt. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleEmailReceipt = () => {
    const subject = encodeURIComponent(`Donation Receipt - ${receiptId}`)
    const body = encodeURIComponent(
      `Thank you for your donation to Khadim-e-Millat Welfare Foundation.\n\n` +
      `Amount: ${currency} ${amount.toLocaleString('en-IN')}\n` +
      `Receipt ID: ${receiptId}\n` +
      `Date: ${donationDate}\n` +
      // (wants80G ? `80G Certificate Number: ${certificateNumber}\n` : '') +
      `\nMay Allah reward you for your generosity.`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🤲 Alhamdulillah! I just donated ${currency} ${amount.toLocaleString('en-IN')} to Khadim-e-Millat Welfare Foundation for ${programName}. ` +
      // `${wants80G ? 'Also received 80G tax exemption certificate. ' : ''}` +
      `May Allah accept our contributions and help those in need. 🤲`
    )
    window.open(`https://wa.me/?text=${text}`)
  }

  const generateReceiptContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Donation Receipt - ${receiptId}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 700px; 
      margin: 0 auto; 
      padding: 20px; 
      line-height: 1.6;
      color: #1a1a1a;
    }
    .header { 
      display: flex;
      align-items: flex-end;
      gap: 20px;
      border-bottom: 3px solid #2563eb; 
      padding-bottom: 25px; 
      margin-bottom: 30px; 
    }
    .logo-section {
      flex-shrink: 0;
    }
    .logo {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 12px;
      display: block;
    }
    .org-info {
      flex: 1;
    }
    .org-name {
      font-size: 24px;
      font-weight: 700;
      color: #1e3a8a;
      line-height: 1.2;
    }
    .org-tagline {
      font-size: 14px;
      color: #6b7280;
    }
    .receipt-type {
      background: linear-gradient(135deg, #059669, #047857);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }
    .content { 
      padding: 0; 
    }
    .details-section {
      background: #f8fafc;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      border: 1px solid #e2e8f0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 0; 
    }
    td { 
      padding: 12px 0; 
      border-bottom: 1px solid #e5e7eb; 
      vertical-align: top;
    }
    td:last-child {
      border-bottom: none;
    }
    .label { 
      font-weight: 600; 
      color: #374151;
      width: 40%;
    }
    .value {
      color: #1f2937;
      font-weight: 500;
    }
    .amount { 
      font-size: 20px; 
      font-weight: 700; 
      color: #059669; 
    }
    .certificate-section {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .certificate-title {
      font-size: 16px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tax-info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 15px 0;
      border-radius: 6px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 25px;
      border-top: 2px solid #e5e7eb;
    }
    .thank-you {
      font-size: 18px;
      font-weight: 600;
      color: #059669;
      margin-bottom: 15px;
    }
    .org-details {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.5;
    }
    .generated-info {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 20px;
      font-style: italic;
    }
    @media print {
      body { margin: 0; padding: 15px; }
      .header { page-break-inside: avoid; }
      .certificate-section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-section">
      <div class="logo"><img width="80" height="80" src="https://www.khadimemillat.org/android-chrome-512x512.png" alt="Logo" /></div>
    </div>
    <div class="org-info">
      <div class="org-name">Khadim-e-Millat<br>Welfare Foundation</div>
      <div class="org-tagline">Serving humanity with compassion and care</div>
    </div>
    <div class="receipt-type">📄 Donation Receipt</div>
  </div>
  
  <div class="content">
    <div class="details-section">
      <div class="section-title">📋 Donation Details</div>
      <table>
        <tr><td class="label">Donor Name:</td><td class="value">${donorName}</td></tr>
        <tr><td class="label">Amount Donated:</td><td class="value amount">${currency} ${amount.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Purpose:</td><td class="value">${programName}</td></tr>
        ${campaignName ? `<tr><td class="label">Campaign/Project:</td><td class="value">${campaignName}</td></tr>` : ''}
        <tr><td class="label">Donation Date:</td><td class="value">${donationDate}</td></tr>
        <tr><td class="label">Receipt ID:</td><td class="value">${receiptId}</td></tr>
        <tr><td class="label">Transaction ID:</td><td class="value">${razorpayPaymentId || donationId.slice(-8)}</td></tr>
      </table>
    </div>

    ${/* 80G Certificate Section Commented out
    wants80G ? `
    <div class="certificate-section">
      <div class="certificate-title">🏛️ 80G Tax Exemption Certificate</div>
      <table>
        <tr><td class="label">Certificate Number:</td><td class="value">${certificateNumber || 'Processing...'}</td></tr>
        <tr><td class="label">Financial Year:</td><td class="value">${new Date().getMonth() >= 3 ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}` : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`}</td></tr>
        <tr><td class="label">Eligibility:</td><td class="value">100% deductible under Section 80G</td></tr>
      </table>
      
      <div class="tax-info">
        <strong>📋 Important Tax Information:</strong><br>
        • This donation is eligible for 100% deduction under Section 80G of Income Tax Act, 1961<br>
        • Keep this certificate for your tax filing records<br>
        • Our organization is registered under Section 80G with valid approval<br>
        • Form 10BD will be filed electronically by our organization<br>
        • Form 10BE will be available in your e-filing account for automatic pre-filling
      </div>
    </div>
    ` : ''
    */ ''}

    <div class="footer">
      <div class="thank-you">🌟 Jazakallahu Khairan for your generous contribution!</div>
      <div class="org-details">
        <strong>Khadim-e-Millat Welfare Foundation</strong><br>
        Registered under Indian Trust Act 1882<br>
        PAN: AABCK1234E<br>
        Email: contact@khadimemillat.org | Phone: +91 80817 47259<br>
        Website: www.khadimemillat.org
      </div>
      <div class="generated-info">
        This is a computer-generated receipt. Generated on ${new Date().toLocaleString('en-IN')}
      </div>
    </div>
  </div>
</body>
</html>`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 dark:from-green-800 to-blue-50 dark:to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Donation Successful! 🤲
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Jazakallahu Khairan for your generous contribution
          </p>
        </div>

        {/* Donation Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Donation Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Donor Name:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{donorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                {currency} {amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Program:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{programName}</span>
            </div>
            {campaignName && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Campaign:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{campaignName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{donationDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Receipt ID:</span>
              <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{receiptId}</span>
            </div>
          </div>
        </div>

        {/* 80G Certificate Info (Disabled per requirements) */}
        {/* wants80G && certificateNumber && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              🏛️ 80G Tax Exemption Certificate
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Certificate Number:</span>
                <span className="font-mono text-sm text-blue-900 dark:text-blue-100">{certificateNumber}</span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Your 80G certificate has been included in the receipt email. Form 10BD will be filed electronically with the Income Tax Department.
              </p>
            </div>
          </div>
        ) */}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleEmailReceipt} variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Receipt
            </Button>
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full bg-blue-600 hoact:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {isSharing ? 'Sharing...' : 'Share Your Good Deed'}
            </Button>
          </div>

        </div>

        {/* Inspiring Message */}
        <div className="mt-8 text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
          <p className="text-gray-700 font-medium mb-2">
            "The believer's shade on the Day of Resurrection will be his charity."
          </p>
          <p className="text-sm text-gray-600">- Prophet Muhammad (ﷺ)</p>
        </div>

        {/* Membership Prompt */}
        {showMembership && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Become a Verified Member</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Join our community as a verified member to access exclusive features including detailed financial reports, 
                  impact analytics, and member-only updates. Membership requires identity verification for transparency.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/membership/request">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Apply for Membership
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMembership(false)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Next Steps:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check your email for the detailed receipt{/* wants80G ? ' and 80G certificate' : '' */}</li>
            <li>• Keep this receipt for your records</li>
            {/* wants80G && <li>• Form 10BE will appear in your e-filing account automatically</li> */}
            <li>• Follow our impact updates on social media</li>
            {showMembership && <li>• Consider applying for verified membership for exclusive access</li>}
          </ul>
        </div>
      </Card>
    </div>
  )
}