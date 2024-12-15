'use client'

import React from 'react'
import { Button } from '../ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'

const Header = () => {
  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <Button onClick={() => signOut({ redirectTo: '/' })}>Sign out</Button>
      ) : (
        <Button
          onClick={() => {
            signIn('google')
          }}
        >
          Click me
        </Button>
      )}
    </div>
  )
}

export default Header
