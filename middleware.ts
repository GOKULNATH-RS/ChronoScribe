import { auth } from '@/auth'
import { NextResponse } from 'next/server'

/**
 * Middleware — protect /dashboard and /create-mail.
 * NextAuth v5 redirects unauthenticated users to `pages.signIn` (set to '/' in auth.ts).
 */
export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/dashboard', '/create-mail']
}
