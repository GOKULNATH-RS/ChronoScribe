import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

const SMTP_USERNAME = process.env.SMTP_USERNAME
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
})

export async function GET(req: NextRequest) {
  try {
    const today = new Date()
    const startOfDayTime = new Date(today)
    startOfDayTime.setHours(0, 0, 0, 0)

    const endOfDayTime = new Date(today)
    endOfDayTime.setHours(23, 59, 59, 999)

    await connectDB()

    const todayMails = await Mail.find({
      target_date: { $gte: startOfDayTime, $lte: endOfDayTime }
    })

    for (const mail of todayMails) {
      const mailOptions = {
        from: 'message@timecapsule.gokulnathrs.me',
        to: mail.to,
        subject: mail.subject,
        text: mail.message
      }

      try {
        const res = await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${mail.to}: ${res.response}`)

        // Update mail_sent_count
        await Mail.findByIdAndUpdate(mail._id, {
          mail_sent_count: mail.mail_sent_count + 1
        })

        // Handle recurring mails
        if (mail.is_recurring) {
          let nextTargetDate = new Date(mail.target_date)
          if (mail.recurring_frequency === 'day') {
            nextTargetDate.setDate(nextTargetDate.getDate() + 1)
          } else if (mail.recurring_frequency === 'month') {
            nextTargetDate.setMonth(nextTargetDate.getMonth() + 1)
          } else if (mail.recurring_frequency === 'year') {
            nextTargetDate.setFullYear(nextTargetDate.getFullYear() + 1)
          }
          await Mail.findByIdAndUpdate(mail._id, {
            target_date: nextTargetDate
          })
        }
      } catch (err) {
        console.error(`Error sending email to ${mail.to}:`, err)
      }
    }

    return NextResponse.json({ message: 'Emails processed successfully.' })
  } catch (err) {
    console.error('Error processing emails:', err)
    return NextResponse.json(
      { error: 'Error processing emails.' },
      { status: 500 }
    )
  }
}
