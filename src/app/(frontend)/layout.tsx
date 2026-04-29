import React from 'react'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jbm = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbm',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={jbm.className}>{children}</body>
    </html>
  )
}
