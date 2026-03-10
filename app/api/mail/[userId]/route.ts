import { auth } from '@/auth'
import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params

  // Users can only access their own mails
  if (String(session._id) !== String(userId)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  try {
    // Filter at the DB level — never load the entire collection into memory
    const mails = await Mail.find({ userId })

    let totalActive = 0
    let total = 0
    let totalMailsSent = 0
    let recurringMails = 0

    for (const mail of mails) {
      total++
      if (mail.active) totalActive++
      if (mail.is_recurring) recurringMails++
      totalMailsSent += mail.mail_sent_count
    }

    return NextResponse.json({
      mails,
      total,
      totalactive: totalActive,
      totalmailssent: totalMailsSent,
      recurringMails
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Error fetching mails' },
      { status: 500 }
    )
  }
}
