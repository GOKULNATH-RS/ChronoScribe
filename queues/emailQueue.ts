import { ConnectionOptions, Queue } from 'bullmq'

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD,
  // Required for managed Redis providers (Upstash, Redis Cloud, etc.)
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined
}

const emailQueue = new Queue('emailQueue', {
  connection,
  defaultJobOptions: {
    // Retry up to 5 times with exponential backoff (1m → 2m → 4m → 8m → 16m)
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 60_000
    },
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs for auditing
    removeOnFail: false               // Never auto-remove failed jobs — inspect manually
  }
})

export default emailQueue
