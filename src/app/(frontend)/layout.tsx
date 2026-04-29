import React from 'react'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jbm = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbm',
})

const siteDescription =
  'Pappas Restaurant Group prides itself on providing an exceptional dining experience, combining exquisite cuisine with unparalleled service in a warm and inviting atmosphere.'

export const metadata: Metadata = {
  // metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
  title: 'Pappas Restaurant Group',
  description: siteDescription,
  openGraph: {
    title: 'Pappas Restaurant Group',
    description: siteDescription,
    url: '/',
    siteName: 'Pappas Restaurant Group',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Pappas Restaurant Group',
    description: siteDescription,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={jbm.className}>{children}</body>
    </html>
  )
}
