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
import { Send } from 'lucide-react'
import { useState } from 'react'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const page = () => {
  const [recurring, setRecurring] = useState(false)
  const [recurringValue, setRecurringValue] = useState<string>('')
  const [recipientEmail, setRecipientEmail] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [dateToSend, setDateToSend] = useState<Date>()
  const { data: session }: any = useSession()

  const router = useRouter()

  const handleCreateMail = () => {
    console.log({
      recipientEmail,
      subject,
      message,
      dateToSend,
      recurring,
      recurringValue
    })

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
        success: (data) => {
          return `Mail scheduled successfully`
        },
        error: 'Error'
      }
    )
  }

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='flex flex-col'>
        <div className='flex gap-2'>
          <div className='p-4'>
            <p className='font-semibold text-white text-xl'>Recipient email</p>
            <Input
              placeholder='Type recipient email here'
              className='min-w-[350px]'
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <div className='p-4'>
            <p className='font-semibold text-white text-xl'>Subject</p>
            <Input
              placeholder='Type your subject here'
              className='min-w-[350px]'
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
        <div className='w-full p-4 '>
          <p className='font-semibold text-white text-xl'>Message</p>
          <Textarea
            placeholder='Type your message here'
            rows={6}
            className='w-full bg-background/15'
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className='w-full flex justify-center'>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-white text-xl'>
              Date to send Email
            </p>
            <DatePicker setFunction={setDateToSend} />
          </div>
        </div>
        <div className='py-2 w-full '>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-white text-lg'>Recurring Email</p>
            <Switch
              onCheckedChange={(checked) => {
                setRecurring(checked)
              }}
            />
          </div>
          {recurring && (
            <div className='flex items-center gap-2 m-2 duration-600 ease-in'>
              <p className='font-semibold text-white text-md'>Repeat every</p>
              <Select onValueChange={(value) => setRecurringValue(value)}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select frequency' />
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
        <div className='w-full flex justify-center my-1'>
          <Button
            onClick={handleCreateMail}
            className='bg-yellow hover:bg-[#ffc32b] w-max px-10 font-bricolage font-semibold text-black text-lg'
          >
            Ping your Future Self
            <Send size={24} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
