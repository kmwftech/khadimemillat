import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { notificationService } from '../../../../../lib/services/notification.service'

// POST: subscribe current user to web push
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    const body = await req.json()
    if (!body?.subscription) return new NextResponse('Missing subscription', { status: 400 })
    await notificationService.subscribeToWebPush(userId, body.subscription)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[WEB_PUSH_SUBSCRIBE_POST]', e)
    return new NextResponse('Server error', { status: 500 })
  }
}

// DELETE: unsubscribe current user from web push
export async function DELETE() {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })
    await notificationService.unsubscribeFromWebPush(userId)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[WEB_PUSH_SUBSCRIBE_DELETE]', e)
    return new NextResponse('Server error', { status: 500 })
  }
}
