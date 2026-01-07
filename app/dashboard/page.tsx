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
  const [isLoading, setIsLoading] = useState(true)
  const { data: session }: any = useSession()

  useEffect(() => {
    const fetchMails = async () => {
      if (!session) return
      setIsLoading(true)
      try {
        const response = await axios.get(`/api/mail/${session?._id}`)
        const { mails, total, totalactive, totalmailssent, recurringMails } = response.data
        setTotalMails(total)
        setTotalActiveMails(totalactive)
        setTotalMailsSent(totalmailssent)
        setMails(mails)
        setRecurringMails(recurringMails)
      } catch (err) {
        console.error('Error fetching mails', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMails()
  }, [session])

  return (
    <div className='max-w-6xl mx-auto px-6 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bricolage font-bold'>Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>Overview of your scheduled mails</p>
        </div>
        <Link href='/create-mail'>
          <Button className='bg-yellow'>Create Mail</Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='rounded-xl p-4 bg-background/10 shadow-sm'>
              <div className='h-3 w-24 bg-white/10 mb-4 rounded animate-pulse' />
              <div className='h-10 w-full bg-white/10 rounded animate-pulse' />
            </div>
          ))
        ) : (
          <>
            <div className='rounded-xl p-4 bg-background/10 shadow-sm'>
              <p className='text-xs text-text uppercase tracking-widest'>Total mails</p>
              <div className='mt-4 text-right'>
                <span className='text-4xl font-bricolage font-bold'>
                  {totalMails > 9 ? totalMails : `0${totalMails}`}
                </span>
              </div>
            </div>
            <div className='rounded-xl p-4 bg-background/10 shadow-sm'>
              <p className='text-xs text-text uppercase tracking-widest'>Active</p>
              <div className='mt-4 text-right'>
                <span className='text-4xl font-bricolage font-bold'>
                  {totalActiveMails > 9 ? totalActiveMails : `0${totalActiveMails}`}
                </span>
              </div>
            </div>
            <div className='rounded-xl p-4 bg-background/10 shadow-sm'>
              <p className='text-xs text-text uppercase tracking-widest'>Mails sent</p>
              <div className='mt-4 text-right'>
                <span className='text-4xl font-bricolage font-bold'>
                  {totalMailsSent > 9 ? totalMailsSent : `0${totalMailsSent}`}
                </span>
              </div>
            </div>
            <div className='rounded-xl p-4 bg-background/10 shadow-sm'>
              <p className='text-xs text-text uppercase tracking-widest'>Recurring</p>
              <div className='mt-4 text-right'>
                <span className='text-4xl font-bricolage font-bold'>
                  {recurringMails > 9 ? recurringMails : `0${recurringMails}`}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <section>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bricolage font-semibold'>Mails</h2>
        </div>

        <div className='bg-background/5 rounded-lg overflow-hidden shadow-sm'>
          <div className='grid grid-cols-6 gap-4 px-6 py-3 text-sm font-semibold border-b border-white/10'>
            <div className='col-span-2'>Recipient</div>
            <div>Content</div>
            <div>Date</div>
            <div>Recurring</div>
            <div>Status</div>
          </div>
          <div>
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className='grid grid-cols-6 gap-4 px-6 py-4 items-center'>
                    <div className='col-span-2'>
                      <div className='h-4 bg-white/10 rounded w-48 animate-pulse' />
                    </div>
                    <div>
                      <div className='h-4 bg-white/10 rounded w-56 animate-pulse' />
                    </div>
                    <div>
                      <div className='h-4 bg-white/10 rounded w-32 animate-pulse' />
                    </div>
                    <div>
                      <div className='h-4 bg-white/10 rounded w-24 animate-pulse' />
                    </div>
                    <div>
                      <div className='h-4 bg-white/10 rounded w-20 animate-pulse' />
                    </div>
                  </div>
                ))
              : mails.map((mail: any) => (
                  <div
                    key={mail._id}
                    className='grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-white/2'
                  >
                    <div className='col-span-2 truncate'>{mail.to}</div>
                    <div>
                      <Dialog>
                        <DialogTrigger>
                          <Button variant={'outline'} size={'sm'}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle className='font-semibold'>{mail.subject}</DialogTitle>
                          <DialogDescription className='my-2 whitespace-pre-wrap'>{mail.message}</DialogDescription>
                          <div className='mt-4 text-sm text-muted-foreground'>
                            To: {mail.to}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div>{new Date(mail.target_date).toDateString()}</div>
                    <div>
                      {mail.is_recurring ? `Every ${mail.recurring_frequency}` : 'Once'}
                    </div>
                    <div>{mail.active ? 'Active' : 'Inactive'}</div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default page
