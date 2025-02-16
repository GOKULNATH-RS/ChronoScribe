'use client'

import React from 'react'
import { Button } from '../ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Telescope } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'

const Header = () => {
  const { data: session } = useSession()

  return (
    <header className='w-full flex justify-between items-center p-4 my-10 '>
      <div>
        <Link href='/'>
          <p className='font-bricolage font-bold text-xl inline-flex'>
            Chrono<span className='text-'>Scribe</span>
            <Telescope size={26} className='text-yellow mx-1' />
          </p>
        </Link>
      </div>
      <div>
        {session ? (
          <div className='flex justify-center items-center gap-2'>
            <Link href='/dashboard'>
              <Button variant={'link'} className='font-bricolage text-lg '>
                Dashboard
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className=''>
                <Avatar>
                  <AvatarImage src={session?.user?.image as string} />
                  <AvatarFallback className=''>
                    {session?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-greydark min-w-[150px]'>
                <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-center '>
                  <button className='w-full m-0 bg-transparent '>
                    Dashboard
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className='p-0'>
                  <Button
                    variant={'outline'}
                    className='w-full m-1 mt-2 p-1 bg-transparent'
                    onClick={() => signOut({ redirectTo: '/' })}
                  >
                    Sign out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            onClick={() => {
              signIn('google')
            }}
            className='bg-yellow'
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  )
}

export default Header
