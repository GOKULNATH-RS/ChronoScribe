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
  password: process.env.REDIS_PASSWORD
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.SMTP_USERNAME!,
    pass: process.env.SMTP_PASSWORD!
  }
})

const connectDB = async () => {
  let isDBConnected

  if (isDBConnected) return

  const MONGO_URI = process.env.MONGO_URI_PROD

  try {
    await mongoose.connect(MONGO_URI as string)
    console.log('DB Connected')
    isDBConnected = true
  } catch (error) {
    console.log('DB Connection error', error)
  }
}

function getNextTargetDate(
  targetDate: string,
  frequency: 'day' | 'month' | 'year'
): Date {
  const nextDate = new Date(targetDate)
  if (frequency === 'day') nextDate.setDate(nextDate.getDate() + 1)
  else if (frequency === 'month') nextDate.setMonth(nextDate.getMonth() + 1)
  else if (frequency === 'year')
    nextDate.setFullYear(nextDate.getFullYear() + 1)
  return nextDate
}

const emailWorker = new Worker<EmailJobData>(
  'emailQueue',
  async (job: Job<EmailJobData>) => {
    const {
      id,
      to,
      subject,
      text,
      is_recurring,
      target_date,
      recurring_frequency
    } = job.data

    try {
      await connectDB()

      const mailOptions = {
        from: 'message@timecapsule.gokulnathrs.me',
        to,
        subject,
        text
      }
      const response = await transporter.sendMail(mailOptions)

      console.log(`Email sent to ${to}: ${response.response}`)

      const updatedMail = await Mail.findByIdAndUpdate(
        id,
        {
          $inc: { mail_sent_count: 1 },
          ...(is_recurring && {
            target_date: getNextTargetDate(target_date, recurring_frequency)
          })
        },
        { new: true }
      )

      console.log('Mail updated:', updatedMail)
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
    }
  },
  { connection: redisConnection }
)

// Start worker and handle connection
connectDB().catch((error) => {
  console.error('Error connecting to MongoDB:', error)
  process.exit(1)
})

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`)
})

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err)
})

export default emailWorker
