import mongoose from 'mongoose'

const mailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  target_date: { type: Date, required: true },
  is_recurring: { type: Boolean, required: true },
  mail_sent_count: { type: Number, default: 0 },
  userId: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  completed: { type: Boolean, default: false }
})

const Mail = mongoose.models.Mail || mongoose.model('Mail', mailSchema)

export default Mail
