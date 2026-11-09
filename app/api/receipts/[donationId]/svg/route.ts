import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import CampaignDonation from '@/models/CampaignDonation'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ donationId: string }> }
) {
  try {
    await connectDB()
    
    const { donationId } = await context.params
    
    // Fetch donation details
    const donation = await CampaignDonation.findById(donationId)
      .populate('campaignId', 'name')
      .populate('programId', 'name')
      .lean()
    
    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    const donationData = donation as any
    const campaignName = donationData.campaignId?.name
    const programName = donationData.programId?.name || 'General Donation'
    const donationDate = new Date(donationData.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    
    // Generate SVG for the receipt (lightweight alternative to Puppeteer)
    const receiptSVG = generateReceiptSVG({
      donorName: donationData.donorName,
      amount: donationData.amount,
      currency: 'INR',
      receiptId: donationData._id.toString().slice(-8),
      certificateNumber: donationData.certificate80G?.certificateNumber,
      wants80G: donationData.wants80GReceipt || false,
      campaignName,
      programName,
      donationDate,
      donationId: donationData._id.toString()
    })

    // Return the SVG
    return new NextResponse(receiptSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="donation-receipt-${donationData._id.toString().slice(-8)}.svg"`
      }
    })

  } catch (error) {
    console.error('Error generating receipt SVG:', error)
    return NextResponse.json(
      { error: 'Failed to generate receipt image' },
      { status: 500 }
    )
  }
}

function generateReceiptSVG(data: {
  donorName: string
  amount: number
  currency: string
  receiptId: string
  certificateNumber?: string
  wants80G: boolean
  campaignName?: string
  programName?: string
  donationDate: string
  donationId: string
}): string {
  const width = 600
  const height = 700
  
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.1"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#backgroundGradient)"/>
  
  <!-- Card Background -->
  <rect x="40" y="40" width="${width-80}" height="${height-80}" rx="16" fill="white" filter="url(#shadow)"/>
  
  <!-- Header -->
  <rect x="40" y="40" width="${width-80}" height="140" rx="16 16 0 0" fill="url(#headerGradient)"/>
  
  <!-- Logo and Title -->
  <text x="${width/2}" y="80" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">🤲 Khadim-e-Millat</text>
  <text x="${width/2}" y="105" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.9">Welfare Foundation</text>
  
  <!-- Receipt Badge -->
  <rect x="${width/2 - 60}" y="140" width="120" height="30" rx="15" fill="rgba(255,255,255,0.2)"/>
  <text x="${width/2}" y="160" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="600">Donation Receipt</text>
  
  <!-- Success Icon and Text -->
  <circle cx="${width/2}" cy="230" r="32" fill="#10b981"/>
  <text x="${width/2}" y="240" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">✓</text>
  
  <text x="${width/2}" y="280" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="20" font-weight="bold">Donation Successful!</text>
  <text x="${width/2}" y="305" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">Jazakallahu Khairan for your contribution</text>
  
  <!-- Details Section -->
  ${generateDetailsSection(data, 340)}
  
  ${/* data.wants80G && data.certificateNumber ? generateCertificateSection(data, height - 200) : */ ''}
  
  <!-- Footer -->
  <text x="${width/2}" y="${height - 80}" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="12">Thank you for your generous donation. Your contribution helps us serve those in need.</text>
  <text x="${width/2}" y="${height - 60}" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="14" font-weight="600">Khadim-e-Millat Welfare Foundation</text>
  <text x="${width/2}" y="${height - 40}" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="10">Registered Charity</text>
  <text x="${width/2}" y="${height - 25}" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="10">Contact: support@khadimemillat.org</text>
</svg>
  `
}

function generateDetailsSection(data: any, startY: number): string {
  const details = [
    { label: 'Donor Name:', value: data.donorName },
    { label: 'Amount:', value: `${data.currency} ${data.amount.toLocaleString('en-IN')}`, isAmount: true },
    { label: 'Program:', value: data.programName },
    ...(data.campaignName ? [{ label: 'Campaign:', value: data.campaignName }] : []),
    { label: 'Date:', value: data.donationDate },
    { label: 'Receipt ID:', value: data.receiptId }
  ]
  
  return details.map((detail, index) => {
    const y = startY + (index * 35)
    return `
      <line x1="80" y1="${y + 20}" x2="520" y2="${y + 20}" stroke="#f3f4f6" stroke-width="1"/>
      <text x="80" y="${y + 10}" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">${detail.label}</text>
      <text x="520" y="${y + 10}" text-anchor="end" fill="${detail.isAmount ? '#10b981' : '#1f2937'}" font-family="Arial, sans-serif" font-size="${detail.isAmount ? '16' : '14'}" font-weight="${detail.isAmount ? 'bold' : '600'}">${detail.value}</text>
    `
  }).join('')
}

function generateCertificateSection(data: any, y: number): string {
  return `
    <!-- Certificate Background -->
    <rect x="80" y="${y - 60}" width="440" height="80" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
    
    <!-- Certificate Title -->
    <text x="90" y="${y - 35}" fill="#1e40af" font-family="Arial, sans-serif" font-size="16" font-weight="bold">🏛️ 80G Tax Exemption Certificate</text>
    
    <!-- Certificate Number -->
    <text x="90" y="${y - 15}" fill="#1e40af" font-family="Arial, sans-serif" font-size="12">Certificate Number:</text>
    <text x="90" y="${y}" fill="#1e40af" font-family="Courier New, monospace" font-size="14" font-weight="bold">${data.certificateNumber}</text>
  `
}