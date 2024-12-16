import Mail from '@/db/models/mailModel'
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

export async function GET(req: NextRequest) {
  const today = new Date()
  const startOfDay = new Date(today)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  const todayMail = await Mail.find({
    target_date: { $gte: startOfDay, $lte: endOfDay } // Between start and end of today
  })

  todayMail.map(async (mail) => {
    const mailOptions = {
      from: 'message@timecapsule.gokulnathrs.me',
      to: mail.to,
      subject: mail.subject,
      text: mail.message
    }

    transporter.sendMail(mailOptions, async function (err, res) {
      if (err) {
        console.log(err)
      } else {
        console.log('Email sent to ' + mail.to + ': ' + res.response)
        await Mail.findByIdAndUpdate(mail._id, {
          mail_sent_count: mail.mail_sent_count + 1
        })

        if (mail.is_recurring) {
          if (mail.recurring_frequency === 'day') {
            const nextDay = new Date(today)
            nextDay.setDate(nextDay.getDate() + 1)
            await Mail.findByIdAndUpdate(mail._id, { target_date: nextDay })
          } else if (mail.recurring_frequency === 'month') {
            const nextMonth = new Date(today)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            await Mail.findByIdAndUpdate(mail._id, { target_date: nextMonth })
          } else if (mail.recurring_frequency === 'year') {
            const nextYear = new Date(today)
            nextYear.setFullYear(nextYear.getFullYear() + 1)
            await Mail.findByIdAndUpdate(mail._id, { target_date: nextYear })
          }
        }
      }
    })
  })

  return NextResponse.json({ message: 'Email sent' })
}
