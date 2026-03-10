import { auth } from '@/auth'
import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// CREATE MAIL
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const {
    recipientEmail: to,
    subject,
    message,
    dateToSend: target_date,
    recurring: is_recurring,
    recurringValue: recurring_frequency,
    userId
  } = body

  // Server-side validation
  if (!to || !EMAIL_RE.test(to)) {
    return NextResponse.json({ message: 'Invalid recipient email', type: 'error' }, { status: 400 })
  }
  if (!subject?.trim()) {
    return NextResponse.json({ message: 'Subject is required', type: 'error' }, { status: 400 })
  }
  if (!message?.trim()) {
    return NextResponse.json({ message: 'Message cannot be empty', type: 'error' }, { status: 400 })
  }
  if (!target_date || new Date(target_date) <= new Date()) {
    return NextResponse.json({ message: 'Date must be in the future', type: 'error' }, { status: 400 })
  }
  if (is_recurring && !recurring_frequency) {
    return NextResponse.json({ message: 'Recurring frequency is required', type: 'error' }, { status: 400 })
  }
  // Prevent users from creating mails on behalf of other users
  if (String(session._id) !== String(userId)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  try {
    await Mail.create({
      from: process.env.MAIL_FROM,
      to,
      subject,
      message,
      target_date,
      is_recurring,
      recurring_frequency: is_recurring ? recurring_frequency : '',
      userId
    })

    return NextResponse.json({ message: 'Mail Saved Successfully', type: 'success' })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Error Saving Mail', type: 'error' },
      { status: 500 }
    )
  }
}

// UPDATE MAIL
export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const { mailId, subject, message, target_date, is_recurring, recurring_frequency } = body

  if (!mailId) {
    return NextResponse.json({ message: 'mailId is required' }, { status: 400 })
  }

  try {
    const mail = await Mail.findById(mailId)
    if (!mail) return NextResponse.json({ message: 'Mail not found' }, { status: 404 })
    if (String(mail.userId) !== String(session._id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const updated = await Mail.findByIdAndUpdate(
      mailId,
      { subject, message, target_date, is_recurring, recurring_frequency, queued: false },
      { new: true }
    )
    return NextResponse.json({ message: 'Mail updated successfully', mail: updated })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Error updating mail' },
      { status: 500 }
    )
  }
}

// DELETE MAIL  (DELETE /api/mail?mailId=<id>)
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const mailId = req.nextUrl.searchParams.get('mailId')

  if (!mailId) {
    return NextResponse.json({ message: 'mailId query param is required' }, { status: 400 })
  }

  try {
    const mail = await Mail.findById(mailId)
    if (!mail) return NextResponse.json({ message: 'Mail not found' }, { status: 404 })
    if (String(mail.userId) !== String(session._id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await Mail.findByIdAndDelete(mailId)
    return NextResponse.json({ message: 'Mail deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Error deleting mail' },
      { status: 500 }
    )
  }
}
