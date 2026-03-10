import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var _mongoCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const MONGO_URI = process.env.MONGO_URI_PROD

if (!MONGO_URI) {
  throw new Error('MONGO_URI_PROD environment variable is not defined')
}

// Reuse the connection across hot-reloads (Next.js dev) and serverless invocations
let cached = global._mongoCache

if (!cached) {
  cached = global._mongoCache = { conn: null, promise: null }
}

const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI as string, { bufferCommands: false })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB
