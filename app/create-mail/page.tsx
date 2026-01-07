'use client'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Send, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'

const page = () => {
  const [recurring, setRecurring] = useState(false)
  const [recurringValue, setRecurringValue] = useState<string>('')
  const [recipientEmail, setRecipientEmail] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [dateToSend, setDateToSend] = useState<Date>()
  const { data: session }: any = useSession()

  if (!session) {
    toast('Login to ping yourself')
    return redirect('/')
  }

  const router = useRouter()

  const handleCreateMail = () => {
    // Validation
    if (!recipientEmail || !recipientEmail.includes('@')) {
      toast.error('Please enter a valid recipient email')
      return
    }
    if (!subject) {
      toast.error('Subject is required')
      return
    }
    if (!message) {
      toast.error('Message cannot be empty')
      return
    }
    if (!dateToSend) {
      toast.error('Please select a date to send')
      return
    }

    console.log({ recipientEmail, subject, message, dateToSend, recurring, recurringValue })

    toast.promise(
      axios
        .post('/api/mail', {
          recipientEmail,
          subject,
          message,
          dateToSend,
          recurring,
          recurringValue,
          userId: session?._id
        })
        .then((response) => {
          console.log(response)
          router.push('/dashboard')
        }),
      {
        loading: 'Loading...',
        success: () => `Mail scheduled successfully`,
        error: 'Error'
      }
    )
  }

  return (
    <div className='w-full flex items-center justify-center py-8 px-4'>
      <div className='max-w-2xl w-full bg-background/5 rounded-lg p-6 shadow-md'>
        <div className='flex items-center gap-4 mb-4'>
          <Link href='/dashboard' className='-ml-1'>
            <Button variant={'ghost'} className='p-2'>
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className='text-2xl font-bricolage font-semibold'>Ping your future self</h1>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Recipient email</label>
            <Input
              placeholder='name@example.com'
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Subject</label>
            <Input
              placeholder='Short subject'
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2'>Message</label>
          <Textarea
            placeholder='Type your message here'
            rows={6}
            className='w-full bg-background/10'
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
          <div className='flex items-center gap-3'>
            <label className='text-sm font-medium'>Date to send</label>
            <DatePicker setFunction={setDateToSend} />
          </div>

          <div className='flex items-center gap-3'>
            <label className='text-sm font-medium'>Recurring</label>
            <Switch onCheckedChange={(checked) => setRecurring(checked)} />
            {recurring && (
              <div className='ml-2'>
                <Select onValueChange={(value) => setRecurringValue(value)}>
                  <SelectTrigger className='w-[160px]'>
                    <SelectValue placeholder='Frequency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='day'>Day</SelectItem>
                    <SelectItem value='month'>Month</SelectItem>
                    <SelectItem value='year'>Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-center'>
          <Button
            onClick={handleCreateMail}
            disabled={!recipientEmail || !subject || !message || !dateToSend}
            className='bg-yellow hover:bg-[#ffc32b] px-6 py-2 font-bricolage font-medium text-black flex items-center gap-2 disabled:opacity-60'
          >
            Ping your Future Self
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
