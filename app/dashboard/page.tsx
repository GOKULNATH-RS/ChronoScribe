'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const page = () => {
  const [totalMails, setTotalMails] = useState(0)
  const [totalActiveMails, setTotalActiveMails] = useState(0)
  const [totalMailsSent, setTotalMailsSent] = useState(0)
  const { data: session } = useSession()

  useEffect(() => {
    // fetch
    axios.get(`/api/mail?userId=${session?._id}`).then((response) => {
      console.log(response.data)
    })
    setTotalMails(7)
    setTotalActiveMails(7)
    setTotalMailsSent(7)
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold font-bricolage'>Dashboard</h1>
      <div className='w-full flex gap-4 my-2 justify-center'>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-sm font-light text-text tracking-widest'>
            TOTAL MAILS
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            0{totalMails}
          </p>
        </div>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-sm font-light text-text tracking-widest'>
            TOTAL ACTIVE MAILS
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            0{totalActiveMails}
          </p>
        </div>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-sm font-light text-text tracking-widest'>
            TOTAL MAILS SENT
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            0{totalMailsSent}
          </p>
        </div>
        <div className='w-[250px] h-[150px] bg-black/40 rounded-xl relative'>
          <p className='text-center text-lg font-light text-text tracking-widest'>
            TOTAL MAILS
          </p>
          <p className='text-9xl leading-[100px] font-bold absolute bottom-0 right-1  font-bricolage'>
            07
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
