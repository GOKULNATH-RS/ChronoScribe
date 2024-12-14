import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import { NextRequest, NextResponse } from 'next/server'

// CREATE MAIL
export async function POST(req: NextRequest) {
  await connectDB()

  const body = await req.json()

  const { to, subject, message, target_date, is_recurring, userId } = body

  try {
    await Mail.create({
      from: 'message@timecapsule.gokulnathrs.me',
      to,
      subject,
      message,
      target_date: Date.now(),
      is_recurring,
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
