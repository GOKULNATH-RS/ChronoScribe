import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const SMTP_USERNAME = process.env.SMTP_USERNAME
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
})

export async function POST(req: NextRequest) {
  const { email, subject, text } = await req.json()

  const mailOptions = {
    from: 'message@timecapsule.gokulnathrs.me',
    to: email,
    subject,
    text
  }

  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      console.log(err)
      return NextResponse.json({ message: 'Email Not sent' })
    } else {
      console.log('Email sent: ' + res.response)
      return NextResponse.json({ message: 'Email sent' })
    }
  })

  return NextResponse.json({ message: 'Email sent' })
}
