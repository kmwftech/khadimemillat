import { emailService } from '@/lib/services/email.service'
import { whatsappService } from '@/lib/services/whatsapp.service'
import { smsService } from '@/lib/services/sms.service'
import { notificationService } from '@/lib/services/notification.service'
import { receipt80GService } from '@/lib/services/receipt-80g.service'
import User from '@/models/User'

// Function to send comprehensive thank you notifications for completed donations
export async function sendDonationThankYouNotifications(donation: any) {
    try {
        // Check if notifications have already been sent to prevent duplicates
        if (donation.notificationsSent) {
            console.log(`[DONATION_NOTIFICATIONS_ALREADY_SENT] ${donation._id}`)
            return
        }
        const donorName = donation.donorName || 'Anonymous Donor'
        const donorEmail = donation.donorEmail
        const amount = donation.amount || 0
        const currency = donation.currency || 'INR'
        const donationId = donation._id
        const paymentId = donation.razorpayPaymentId
        const createdAt = new Date(donation.createdAt)
        const wants80G = donation.wants80GReceipt || false

        // Get campaign/program details if available
        let campaignName = 'General Fund'
        let programName = 'General Donation'

        try {
            if (donation.campaignId) {
                const Campaign = (await import('@/models/Campaign')).default
                const campaign = await Campaign.findById(donation.campaignId).select('name title slug').lean()
                if (campaign) {
                    campaignName = (campaign as any).name || (campaign as any).title || campaignName
                }
            }

            if (donation.programId) {
                const WelfareProgram = (await import('@/models/WelfareProgram')).default
                const program = await WelfareProgram.findById(donation.programId).select('title name slug').lean()
                if (program) {
                    programName = (program as any).title || (program as any).name || programName
                    // Also update campaignName to match the program if no specific campaign
                    if (!donation.campaignId) {
                        campaignName = programName
                    }
                }
            }
        } catch (e) {
            console.warn('[CAMPAIGN_PROGRAM_LOOKUP_FAILED]', e)
        }

        // Find user details for additional contact info
        let userPhone = ''
        let userNotificationPrefs = { email: true, whatsapp: true, sms: false }

        try {
            // Try to find user by email first, then by donorId if available
            let user = null

            if (donorEmail && donorEmail.trim()) {
                user = await User.findOne({ email: donorEmail }).select('phone notificationPreferences clerkUserId').lean()
            }

            // If no user found by email and we have a donorId, try finding by Clerk ID
            if (!user && donation.donorId) {
                user = await User.findOne({ clerkUserId: donation.donorId }).select('phone notificationPreferences clerkUserId').lean()
            }

            if (user) {
                userPhone = (user as any).phone || ''
                userNotificationPrefs = (user as any).notificationPreferences || userNotificationPrefs
            }

            // If still no phone found, use the phone from donation directly
            if (!userPhone && donation.donorPhone) {
                userPhone = donation.donorPhone
            }

        } catch (e) {
            console.warn('[USER_LOOKUP_FOR_DONATION_FAILED]', e)
        }

        // Prepare thank you message content
        const receiptDate = createdAt.toLocaleDateString('en-IN')
        const receiptTime = createdAt.toLocaleTimeString('en-IN')

        // Process 80G certificate if requested (Commented out per requirements)
        let certificate80GInfo = null
        /*
        if (wants80G) {
            try {
                console.log(`[80G_CERTIFICATE_PROCESSING_START] ${donationId}`)

                const certificateResult = await receipt80GService.process80GCertificate(donation, true)
                certificate80GInfo = certificateResult

                // Update donation with enhanced certificate details
                const CampaignDonation = (await import('@/models/CampaignDonation')).default
                await CampaignDonation.findByIdAndUpdate(donationId, {
                    $set: {
                        'certificate80G.generated': true,
                        'certificate80G.generatedAt': new Date(),
                        'certificate80G.certificateNumber': certificateResult.certificateNumber,
                        'certificate80G.financialYear': certificateResult.financialYear,
                        'certificate80G.sequenceNumber': certificateResult.sequenceNumber,
                        'certificate80G.issuedBy': 'System',
                        'certificate80G.status': 'generated'
                    },
                    $push: {
                        'certificate80G.deliveryMethods': {
                            method: 'email',
                            sentAt: new Date(),
                            status: 'pending'
                        }
                    }
                })

                console.log(`[80G_CERTIFICATE_GENERATED] ${donationId} - ${certificateResult.certificateNumber}`)
            } catch (certificateError) {
                console.error('[80G_CERTIFICATE_FAILED]', certificateError)
                // Continue with regular email even if 80G fails
            }
        }
        */

        const emailSubject = `Thank you for your donation - Receipt #${donationId.toString().slice(-8)}`

        // Send email notification if email provided
        if (donorEmail && donorEmail.trim() && userNotificationPrefs.email) {
            try {
                // Create simple, clean email with all required details
                let emailMessage = `<p><strong>Alhamdulillah! Your generous donation has been received successfully.</strong></p>

<h3>📋 Donation Receipt</h3>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold; width: 35%;">Donor Name:</td><td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${donorName}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Email:</td><td style="padding: 6px; border: 1px solid #ddd;">${donorEmail}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Amount:</td><td style="padding: 6px; border: 1px solid #ddd; font-weight: bold; color: #059669;">${currency} ${amount.toLocaleString('en-IN')}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Purpose:</td><td style="padding: 6px; border: 1px solid #ddd;">${programName}</td></tr>
  ${campaignName && campaignName !== programName ? `<tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Campaign:</td><td style="padding: 6px; border: 1px solid #ddd;">${campaignName}</td></tr>` : ''}
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Date:</td><td style="padding: 6px; border: 1px solid #ddd;">${receiptDate}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Time:</td><td style="padding: 6px; border: 1px solid #ddd;">${receiptTime}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Receipt ID:</td><td style="padding: 6px; border: 1px solid #ddd;">${donationId.toString().slice(-8)}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">Transaction ID:</td><td style="padding: 6px; border: 1px solid #ddd;">${paymentId || donationId.toString().slice(-8)}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">PAN Required:</td><td style="padding: 6px; border: 1px solid #ddd;">${amount >= 2000 ? 'Yes (Amount ≥ ₹2,000)' : 'No (Amount < ₹2,000)'}</td></tr>
</table>`

                /*
                // Add 80G certificate information if applicable
                if (wants80G && certificate80GInfo) {
                    emailMessage += `
<h3>🏛️ 80G Tax Exemption Certificate</h3>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0; background: #fffbeb; border: 2px solid #f59e0b;">
  <tr><td style="padding: 6px; border: 1px solid #f59e0b; background: #fef3c7; font-weight: bold; width: 35%;">Certificate Number:</td><td style="padding: 6px; border: 1px solid #f59e0b; font-family: monospace; font-weight: bold;">${certificate80GInfo.certificateNumber}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #f59e0b; background: #fef3c7; font-weight: bold;">Financial Year:</td><td style="padding: 6px; border: 1px solid #f59e0b;">${certificate80GInfo.financialYear}</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #f59e0b; background: #fef3c7; font-weight: bold;">Deduction:</td><td style="padding: 6px; border: 1px solid #f59e0b;">100% under Section 80G</td></tr>
  <tr><td style="padding: 6px; border: 1px solid #f59e0b; background: #fef3c7; font-weight: bold;">Eligible Amount:</td><td style="padding: 6px; border: 1px solid #f59e0b;">${currency} ${amount.toLocaleString('en-IN')} (Full Amount)</td></tr>
</table>
<div style="background: #e0f2fe; padding: 10px; border-left: 4px solid #0288d1; margin: 10px 0;">
  <strong>📋 Tax Information:</strong> Keep this certificate for tax filing. Form 10BD will be filed electronically and Form 10BE will appear in your e-filing account.${amount >= 2000 ? ' <strong>Note:</strong> PAN is mandatory for donations ≥ ₹2,000 as per Income Tax rules.' : ''}
</div>`
                } else {
                    // Add tax information even for non-80G donations
                    emailMessage += `
<div style="background: #f8fafc; padding: 10px; border-left: 4px solid #64748b; margin: 10px 0;">
  <strong>📋 Tax Information:</strong> This receipt can be used for tax purposes. ${amount >= 2000 ? 'PAN is mandatory for donations ≥ ₹2,000 as per Income Tax rules.' : 'No PAN required for donations below ₹2,000.'}
</div>`
                }
                */

                emailMessage += `
<div style="background: #f0f9ff; padding: 15px; border: 1px solid #3b82f6; margin: 15px 0;">
  <h4 style="color: #1e40af; margin: 0 0 8px 0;">📄 Access Your Complete Receipt</h4>
  <p style="margin: 5px 0;">Visit your personalized donation page to download formatted receipt, print certificate, and verify details.</p>
  <p style="margin: 5px 0;"><strong><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://khadimemillat.org'}/thank-you?donationId=${donationId}" style="color: #1e40af;">🔗 Click here to access your donation page</a></strong></p>
</div>

<p style="color: #059669; font-weight: bold; margin: 10px 0;">🌟 Jazakallahu Khairan! Your contribution makes a real difference.</p>

<hr style="margin: 15px 0;">
<div style="font-size: 12px; color: #666; line-height: 1.4;">
  <strong>Khadim-e-Millat Welfare Foundation</strong><br>
  📞 +91 80817 47259 | 📧 support@khadimemillat.org | 🌐 www.khadimemillat.org<br>
  PAN: AAICK6626K | CIN: U85300UP2021NPL143120<br>
  ${/* wants80G ? `Section 80G(5)(vi) - 100% deduction allowed | Registration under Income Tax Act, 1961<br>` : */ ''}
  Registered Office: Gorakhpur, Uttar Pradesh, India
</div>`

                const emailTitle = 'Thank You for Your Donation!'

                const emailHtml = emailService.generateDefaultBrandedEmail({
                    title: emailTitle,
                    greetingName: '',
                    message: emailMessage
                })

                await emailService.sendEmail({
                    to: donorEmail,
                    subject: emailSubject,
                    html: emailHtml
                })

                console.log(`[DONATION_EMAIL_SENT] ${donorEmail} - ${donationId} - 80G: ${wants80G}`)
            } catch (emailError) {
                console.error('[DONATION_EMAIL_FAILED]', emailError)
            }
        }



        // Send WhatsApp notification with receipt image if phone available
        if (userPhone && userNotificationPrefs.whatsapp) {
            try {
                // Extract phone number from donation.donorPhone if userPhone is empty
                const phoneToUse = userPhone || donation.donorPhone || ''

                if (phoneToUse) {
                    // Send donation confirmation with receipt image using our enhanced service
                    const whatsappResult = await whatsappService.sendDonationConfirmation(
                        whatsappService.formatPhoneNumber(phoneToUse).replace(/[^\d]/g, ''),
                        {
                            donationId: donationId.toString(),
                            donorName,
                            amount,
                            currency,
                            campaignName,
                            programName,
                            wants80G,
                            razorpayPaymentId: paymentId // Pass the actual Razorpay transaction ID
                        }
                    )

                    if (whatsappResult.success) {
                        console.log(`[DONATION_WHATSAPP_SENT] ${phoneToUse.replace(/[^\d]/g, '')} - ${donationId}`)
                    } else {
                        console.error('[DONATION_WHATSAPP_FAILED]', whatsappResult.error)

                        // Enhanced fallback message with 80G information if applicable
                        let fallbackMessage = `*Assalamu Alaikum ${donorName}*\n\nAlhamdulillah! Your generous donation has been received successfully.\n\n💰 *Amount:* ${currency} ${amount.toLocaleString('en-IN')}\n📋 *Receipt ID:* ${donationId.toString().slice(-8)}\n🏛️ *Program:* ${programName || campaignName || 'General Donation'}\n📅 *Date:* ${new Date().toLocaleDateString('en-IN')}`

                        /*
                        if (wants80G) {
                            fallbackMessage += `\n\n🏛️ *80G Tax Certificate:* Will be generated and sent separately\n💳 *PAN Required:* Yes (for tax exemption)`
                        }
                        */

                        fallbackMessage += `\n\n🔗 *View Details:* ${process.env.NEXT_PUBLIC_APP_URL || 'https://khadimemillat.org'}/thank-you?donationId=${donationId}\n\nJazakallahu Khairan! May Allah accept your donation and bless you abundantly.\n\n_Khadim-e-Millat Welfare Foundation_\n📞 +91 80817 47259`

                        const fallbackResult = await whatsappService.sendMessage({
                            to: whatsappService.formatPhoneNumber(phoneToUse),
                            message: fallbackMessage,
                            userName: donorName
                        })

                        if (fallbackResult.success) {
                            console.log(`[DONATION_WHATSAPP_FALLBACK_SENT] ${phoneToUse} - ${donationId} - 80G: ${wants80G}`)
                        } else {
                            console.error(`[DONATION_WHATSAPP_FALLBACK_FAILED] ${phoneToUse} - ${donationId} - Error: ${fallbackResult.error}`)
                        }
                    }
                }
            } catch (whatsappError) {
                console.error('[DONATION_WHATSAPP_FAILED]', whatsappError)
            }
        }

        // Send SMS notification if enabled
        if (userPhone && userNotificationPrefs.sms) {
            try {
                const smsMessage = `Thank you ${donorName}! Your donation of ${currency} ${amount} to Khadim-e-Millat has been received. Receipt: ${donationId.toString().slice(-8)}. May Allah bless you!`

                await smsService.sendSMS({
                    to: userPhone,
                    message: smsMessage
                } as any)

                console.log(`[DONATION_SMS_SENT] ${userPhone} - ${donationId}`)
            } catch (smsError) {
                console.error('[DONATION_SMS_FAILED]', smsError)
            }
        }

        // Send in-app notification if user exists in system
        try {
            const user = await User.findOne({ email: donorEmail }).select('clerkUserId').lean()
            if (user && (user as any).clerkUserId) {
                await notificationService.notifyUsers([(user as any).clerkUserId], {
                    title: 'Thank You for Your Donation!',
                    body: `Your donation of ${currency} ${amount} has been received successfully. Receipt ID: ${donationId.toString().slice(-8)}`,
                    url: `/donations/${donationId}`,
                    type: 'donation_success'
                })

                console.log(`[DONATION_IN_APP_SENT] ${(user as any).clerkUserId} - ${donationId}`)
            }
        } catch (notificationError) {
            console.error('[DONATION_IN_APP_FAILED]', notificationError)
        }

        console.log(`[DONATION_NOTIFICATIONS_COMPLETED] ${donationId} - Email: ${!!(donorEmail && donorEmail.trim())}, Phone: ${!!userPhone}, 80G: ${wants80G}`)

        // Mark notifications as sent to prevent duplicates
        try {
            const CampaignDonation = (await import('@/models/CampaignDonation')).default
            await CampaignDonation.findByIdAndUpdate(donationId, {
                $set: { notificationsSent: true, notificationsSentAt: new Date() }
            })
        } catch (updateError) {
            console.warn('[DONATION_NOTIFICATION_FLAG_UPDATE_FAILED]', updateError)
        }
    } catch (error) {
        console.error('[DONATION_NOTIFICATION_ERROR]', error)
        throw error
    }
}

// Function to resend donation receipt via WhatsApp with image
export async function resendDonationReceiptWhatsApp(donationId: string, phoneNumber: string) {
    try {
        // Import models dynamically to avoid circular dependencies
        const CampaignDonation = (await import('@/models/CampaignDonation')).default

        // Fetch donation details
        const donation = await CampaignDonation.findById(donationId)
            .populate('campaignId', 'name title')
            .populate('programId', 'title name')
            .lean()

        if (!donation) {
            throw new Error('Donation not found')
        }

        const donationData = donation as any
        const campaignName = donationData.campaignId?.name || donationData.campaignId?.title
        const programName = donationData.programId?.title || donationData.programId?.name || 'General Donation'

        // Send receipt with image
        const result = await whatsappService.sendDonationReceipt(
            whatsappService.formatPhoneNumber(phoneNumber),
            donationId,
            donationData.donorName || 'Valued Donor',
            donationData.amount || 0,
            campaignName || programName,
            donationData.razorpayPaymentId // Pass Razorpay payment ID for transaction reference
        )

        console.log(`[RECEIPT_RESEND_WHATSAPP] ${phoneNumber} - ${donationId} - Success: ${result.success}`)
        return result

    } catch (error) {
        console.error('[RECEIPT_RESEND_WHATSAPP_ERROR]', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to resend receipt'
        }
    }
}

// Function to send 80G certificate via WhatsApp with image
export async function send80GCertificateWhatsApp(donationId: string, phoneNumber: string) {
    try {
        // Import models dynamically to avoid circular dependencies
        const CampaignDonation = (await import('@/models/CampaignDonation')).default

        // Fetch donation details
        const donation = await CampaignDonation.findById(donationId).lean()

        if (!donation) {
            throw new Error('Donation not found')
        }

        const donationData = donation as any

        // Check if 80G certificate exists
        if (!donationData.certificate80G?.certificateNumber) {
            throw new Error('80G certificate not generated for this donation')
        }

        // Send certificate with image
        const result = await whatsappService.send80GCertificate(
            whatsappService.formatPhoneNumber(phoneNumber),
            donationId,
            donationData.donorName || 'Valued Donor',
            donationData.amount || 0,
            donationData.certificate80G.certificateNumber
        )

        console.log(`[80G_CERTIFICATE_RESEND_WHATSAPP] ${phoneNumber} - ${donationId} - Success: ${result.success}`)
        return result

    } catch (error) {
        console.error('[80G_CERTIFICATE_RESEND_WHATSAPP_ERROR]', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send 80G certificate'
        }
    }
}