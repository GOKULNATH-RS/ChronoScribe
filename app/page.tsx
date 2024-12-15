import Header from '@/components/common/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href='/create-mail'>
        <Button className='font-bricolage'>Ping your future self</Button>
      </Link>
    </div>
  )
}
