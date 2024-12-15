import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import { NextRequest, NextResponse } from 'next/server'

// CREATE MAIL
export async function POST(req: NextRequest) {
  await connectDB()

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

  try {
    await Mail.create({
      from: 'message@timecapsule.gokulnathrs.me',
      to,
      subject,
      message,
      target_date,
      is_recurring,
      recurring_frequency,
      userId
    })

    return NextResponse.json({
      message: 'Mail Saved Successfully',
      type: 'success'
    })
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || 'Error Saving Mail',
      type: 'error'
    })
  }
}

// UPDATE MAIL
export async function PUT(req: NextRequest) {
  const body = await req.json()

  return NextResponse.json({ message: '' })
}

// DELETE MAIL
export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: '' })
}

// GET MAIL
export async function GET(req: NextRequest, { params }: any) {
  const userId = req.nextUrl.searchParams.get('userId')
  console.log(userId)

  await connectDB()

  const mails = await Mail.find({ userId })

  var totalactive = 0
  var total = 0
  var totalmailssent = 0

  mails.map((mail) => {
    if (mail.active) {
      totalactive++
    }
    totalmailssent += mail.mail_sent_count
    total++
  })

  return NextResponse.json({ mails, total, totalactive, totalmailssent })
}
