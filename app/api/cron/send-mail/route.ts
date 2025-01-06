import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import nodemailer, { Transport } from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

const SMTP_USERNAME = process.env.SMTP_USERNAME
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

let transporter: Transport | any

if (!transporter) {
  transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD
    }
  })
}

// Database connection state
let isDBConnected = false

async function connectDatabase() {
  if (!isDBConnected) {
    await connectDB()
    isDBConnected = true
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDatabase()

    // Get start and end times for the current day
    const today = new Date()
    const startOfDayTime = new Date(today).setHours(0, 0, 0, 0)
    const endOfDayTime = new Date(today).setHours(23, 59, 59, 999)

    // Fetch today's emails
    const todayMails = await Mail.find({
      target_date: { $gte: startOfDayTime, $lte: endOfDayTime }
    })

    // Process emails concurrently
    await Promise.all(
      todayMails.map(async (mail) => {
        const mailOptions = {
          from: 'message@timecapsule.gokulnathrs.me',
          to: mail.to,
          subject: mail.subject,
          text: mail.message
        }

        try {
          const res = await transporter.sendMail(mailOptions)
          console.log(`Email sent to ${mail.to}: ${res.response}`)

          await Mail.findByIdAndUpdate(mail._id, {
            $inc: { mail_sent_count: 1 },
            ...(mail.is_recurring && {
              target_date: getNextTargetDate(mail)
            })
          })
        } catch (err) {
          console.error(`Error sending email to ${mail.to}:`, err)
        }
      })
    )

    return NextResponse.json({ message: 'Emails processed successfully.' })
  } catch (err) {
    console.error('Error processing emails:', err)
    return NextResponse.json(
      { error: 'Error processing emails.' },
      { status: 500 }
    )
  }
}

function getNextTargetDate(mail: any) {
  const nextDate = new Date(mail.target_date)
  if (mail.recurring_frequency === 'day')
    nextDate.setDate(nextDate.getDate() + 1)
  else if (mail.recurring_frequency === 'month')
    nextDate.setMonth(nextDate.getMonth() + 1)
  else if (mail.recurring_frequency === 'year')
    nextDate.setFullYear(nextDate.getFullYear() + 1)
  return nextDate
}
