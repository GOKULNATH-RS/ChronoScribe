import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI_PROD

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string)
    console.log('DB Connected')
  } catch (error) {
    console.log('DB Connection error', error)
  }
}

export default connectDB
