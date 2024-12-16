import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/ui/flip-words'
import Link from 'next/link'

export default function Home() {
  const words = ['Memories', 'Goals', 'Accomplisments', 'Reminder']
  return (
    <div className='min-h-[20rem] flex flex-col justify-center '>
      <div className='h-max m-4 px-4'>
        <div className='text-7xl font-normal text-text'>
          Send
          <FlipWords words={words} /> <br />
          to your future self
        </div>
      </div>
      <div className='m-4 px-4 flex gap-1'>
        <Link href='/create-mail'>
          <Button className='font-bricolage bg-yellow text-black text-lg p-4 font-normal hover:bg-[#ffc32b] '>
            Ping your future self
          </Button>
        </Link>
      </div>
    </div>
  )
}
