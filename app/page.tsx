import Header from '@/components/common/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <h1 className='font-bold '>Time Capsule</h1>
      <Header />
      <Button className='font-bricolage'>Ping your future self</Button>
    </div>
  )
}
