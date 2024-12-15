'use client'

import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const page = () => {
  const [totalMails, setTotalMails] = useState(0)
  const [totalActiveMails, setTotalActiveMails] = useState(0)
  const [totalMailsSent, setTotalMailsSent] = useState(0)
  const [recurringMails, setRecurringMails] = useState(0)
  const [mails, setMails] = useState([])
  const { data: session }: any = useSession()

  useEffect(() => {
    // fetch
    axios.get(`/api/mail/${session?._id}`).then((response) => {
      const { mails, total, totalactive, totalmailssent, recurringMails } =
        response.data
      setTotalMails(total)
      setTotalActiveMails(totalactive)
      setTotalMailsSent(totalmailssent)
      setMails(mails)
      setRecurringMails(recurringMails)
    })
  }, [session])

  return (
    <div className='mx-40'>
      <h1 className='text-2xl font-bold font-bricolage'>Dashboard</h1>
      <div className='w-full flex gap-4 my-2 justify-center'>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-sm font-light text-text tracking-widest'>
            TOTAL MAILS
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            {totalMails > 9 ? totalMails : `0${totalMails}`}
          </p>
        </div>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-sm font-light text-text tracking-widest'>
            TOTAL ACTIVE MAILS
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            {totalActiveMails > 9 ? totalActiveMails : `0${totalActiveMails}`}
          </p>
        </div>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-sm font-light text-text tracking-widest'>
            TOTAL MAILS SENT
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            {totalMailsSent > 9 ? totalMailsSent : `0${totalMailsSent}`}
          </p>
        </div>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-lg font-light text-text tracking-widest'>
            RECURRING MAILS
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            {recurringMails > 9 ? recurringMails : `0${recurringMails}`}
          </p>
        </div>
      </div>
      <div>
        <div className='w-full flex justify-between items-baseline my-4'>
          <h1 className='text-3xl font-bold font-bricolage'>Mails</h1>
          <Link href='/create-mail'>
            <Button className='bg-yellow'>Create Mail</Button>
          </Link>
        </div>
        <div className='flex gap-4 flex-col pb-2'>
          <div className='grid grid-cols-6 w-full font-bricolage text-xl font-semibold border-b-2 border-white/50 '>
            <p className='col-span-2'>Recipient mail</p>
            <p>Content</p>
            <p>Date To Send</p>
            <p>Recurring</p>
            <p>Status</p>
          </div>
          {mails.map((mail: any) => {
            return (
              <div
                key={mail._id}
                className='grid grid-cols-6 w-full  border-b-[1px] border-text/20 '
              >
                <p className='col-span-2'>{mail.to}</p>
                <p>
                  <Dialog>
                    <DialogTrigger>
                      <Button className='' variant={'outline'}>
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Subject</DialogTitle>
                      <DialogDescription>{mail.subject}</DialogDescription>
                      <DialogTitle>Message</DialogTitle>
                      <DialogDescription>{mail.message}</DialogDescription>
                    </DialogContent>
                  </Dialog>
                </p>
                <p>{new Date(mail.target_date).toDateString()}</p>
                <p>
                  {mail.is_recurring
                    ? `Every ${mail.recurring_frequency}`
                    : 'Once'}
                </p>
                <p>{mail.active ? 'Active' : 'Inactive'}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default page
