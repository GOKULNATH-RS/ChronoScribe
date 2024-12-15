import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/common/Header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'ChronoScribe',
  description:
    'A App that travels time to deliver your messages for your future self'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={` ${inter.className} ${bricolage.variable} antialiased dark bg-grey mx-20`}
      >
        <SessionProvider>
          <Header />
          <Toaster />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
