import { ConnectionOptions, Queue } from 'bullmq'

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD
}

const emailQueue = new Queue('emailQueue', { connection })

export default emailQueue
