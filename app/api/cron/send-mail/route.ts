import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import emailQueue from '@/queues/emailQueue'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` for cron jobs.
  // Reject any request that doesn't carry the correct secret.
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const today = new Date()
    const endOfDay = new Date(today).setHours(23, 59, 59, 999)

    // Fetch today's AND any overdue undelivered mails in one query.
    // This ensures mails that failed on a previous day are retried automatically.
    const mailsDue = await Mail.find({
      target_date: { $lte: endOfDay },
      active: true,
      completed: false,
      queued: false // Only pick up mails not already sitting in the queue
    })

    if (mailsDue.length === 0) {
      return NextResponse.json({ message: 'No emails to process today.', count: 0 })
    }

    // Atomically mark all as queued BEFORE enqueuing.
    // If the cron runs twice (Vercel retries), the second run sees queued: true and skips.
    const mailIds = mailsDue.map((m) => m._id)
    await Mail.updateMany({ _id: { $in: mailIds } }, { queued: true })

    await Promise.all(
      mailsDue.map((mail) =>
        emailQueue.add(
          'sendEmail',
          {
            id: mail._id.toString(),
            to: mail.to,
            subject: mail.subject,
            text: mail.message,
            is_recurring: mail.is_recurring,
            target_date: mail.target_date,
            recurring_frequency: mail.recurring_frequency
          },
          {
            // jobId = mail._id ensures BullMQ deduplicates if the same job is added twice
            jobId: mail._id.toString()
          }
        )
      )
    )

    return NextResponse.json({
      message: `${mailsDue.length} email(s) enqueued successfully.`,
      count: mailsDue.length
    })
  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json({ error: 'Error processing emails.' }, { status: 500 })
  }
}
