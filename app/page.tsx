import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href='/create-mail'>
        <Button className='font-bricolage'>Ping your future self</Button>
      </Link>
      <Link href='/dashboard'>
        <Button className='font-bricolage'>Dashboard</Button>
      </Link>
    </div>
  )
}
