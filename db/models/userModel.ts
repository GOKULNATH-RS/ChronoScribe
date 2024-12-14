import mongoose from 'mongoose'

const UserModel = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String },
  image_url: { type: String },
  current_active_emails: { type: Number, default: 0 },
  total_emails: { type: Number, default: 0 },
  mails_sent: { type: Number, default: 0 }
})

const User = mongoose.models.User || mongoose.model('User', UserModel)

export default User
