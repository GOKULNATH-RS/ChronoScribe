import connectDB from '@/db/db'
import Mail from '@/db/models/mailModel'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: any) {
  const { userId } = await params
  await connectDB()
  console.log(userId)

  const mailsDB = await Mail.find({})

  var totalactive = 0
  var total = 0
  var totalmailssent = 0

  const mails = mailsDB.filter((mail) => {
    return mail.userId == userId
  })

  mails.map((mail) => {
    if (mail.active) {
      totalactive++
    }
    totalmailssent += mail.mail_sent_count
    total++
  })

  return NextResponse.json({ mails, total, totalactive, totalmailssent })
}
