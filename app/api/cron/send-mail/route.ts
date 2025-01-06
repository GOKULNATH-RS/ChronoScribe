import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import emailQueue from '@/queues/emailQueue'
import { NextRequest, NextResponse } from 'next/server'

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

    const today = new Date()
    const startOfDayTime = new Date(today).setHours(0, 0, 0, 0)
    const endOfDayTime = new Date(today).setHours(23, 59, 59, 999)

    const todayMails = await Mail.find({
      target_date: { $gte: startOfDayTime, $lte: endOfDayTime }
    })

    // Enqueue emails
    await Promise.all(
      todayMails.map((mail) =>
        emailQueue.add('sendEmail', {
          id: mail._id,
          to: mail.to,
          subject: mail.subject,
          text: mail.message,
          is_recurring: mail.is_recurring,
          target_date: mail.target_date,
          recurring_frequency: mail.recurring_frequency
        })
      )
    )

    return NextResponse.json({ message: 'Emails enqueued successfully.' })
  } catch (err) {
    console.error('Error processing emails:', err)
    return NextResponse.json(
      { error: 'Error processing emails.' },
      { status: 500 }
    )
  }
}
