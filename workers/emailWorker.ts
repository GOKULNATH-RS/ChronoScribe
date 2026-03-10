import { Worker, Job } from 'bullmq'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'
import Mail from '../db/models/mailModel'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

interface EmailJobData {
  id: string
  to: string
  subject: string
  text: string
  is_recurring: boolean
  target_date: string
  recurring_frequency: 'day' | 'month' | 'year'
}

const redisConnection = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? ({} as any) : undefined
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.SMTP_USERNAME!,
    pass: process.env.SMTP_PASSWORD!
  }
})

let isDBConnected = false

const connectDB = async (): Promise<void> => {
  if (isDBConnected) return
  const MONGO_URI = process.env.MONGO_URI_PROD
  if (!MONGO_URI) throw new Error('MONGO_URI_PROD is not defined')
  await mongoose.connect(MONGO_URI)
  isDBConnected = true
  console.log('MongoDB connected')
}

function getNextTargetDate(
  targetDate: string,
  frequency: 'day' | 'month' | 'year'
): Date {
  const nextDate = new Date(targetDate)
  if (frequency === 'day') nextDate.setDate(nextDate.getDate() + 1)
  else if (frequency === 'month') nextDate.setMonth(nextDate.getMonth() + 1)
  else if (frequency === 'year') nextDate.setFullYear(nextDate.getFullYear() + 1)
  return nextDate
}

const emailWorker = new Worker<EmailJobData>(
  'emailQueue',
  async (job: Job<EmailJobData>) => {
    const { id, to, subject, text, is_recurring, target_date, recurring_frequency } = job.data

    await connectDB()

    // sendMail throws on SMTP failure — BullMQ catches the error and retries
    // according to the attempts/backoff config set in emailQueue.ts.
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM!,
      to,
      subject,
      text
    })

    console.log(`[Job ${job.id}] Delivered to ${to} — messageId: ${info.messageId}`)

    // Update the mail record only after confirmed delivery
    await Mail.findByIdAndUpdate(id, {
      $inc: { mail_sent_count: 1 },
      queued: false,
      ...(is_recurring
        ? { target_date: getNextTargetDate(target_date, recurring_frequency) }
        : { completed: true, active: false }) // One-time mails are deactivated after delivery
    })
  },
  {
    connection: redisConnection,
    concurrency: 5 // Process up to 5 emails simultaneously
  }
)

// Establish DB connection at startup
connectDB().catch((error) => {
  console.error('Fatal: MongoDB connection failed:', error)
  process.exit(1)
})

emailWorker.on('completed', (job) => {
  console.log(`[Job ${job.id}] Completed — email sent to ${job.data.to}`)
})

emailWorker.on('failed', (job, err) => {
  const attempts = job?.attemptsMade ?? 0
  const maxAttempts = job?.opts?.attempts ?? 5
  console.error(`[Job ${job?.id}] Failed (attempt ${attempts}/${maxAttempts}): ${err.message}`)

  // When all BullMQ retries are exhausted, reset the queued flag.
  // The next cron run will re-enqueue this mail, guaranteeing eventual delivery.
  if (attempts >= maxAttempts && job?.data.id) {
    Mail.findByIdAndUpdate(job.data.id, { queued: false }).catch((updateErr) =>
      console.error(`[Job ${job?.id}] Failed to reset queued flag:`, updateErr)
    )
  }
})

emailWorker.on('error', (err) => {
  console.error('Worker error:', err)
})

export default emailWorker
