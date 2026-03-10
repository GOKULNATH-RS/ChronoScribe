import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { email, subject, text } = await req.json()

  if (!email || !subject || !text) {
    return NextResponse.json(
      { message: 'email, subject, and text are required' },
      { status: 400 }
    )
  }

  try {
    // Properly awaited — errors now propagate correctly
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject,
      text
    })

    return NextResponse.json({ message: 'Email sent', messageId: info.messageId })
  } catch (err: any) {
    console.error('Email send error:', err)
    return NextResponse.json(
      { message: 'Email not sent', error: err.message },
      { status: 500 }
    )
  }
}
