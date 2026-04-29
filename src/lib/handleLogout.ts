import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'

export default async function handleLogOut() {
  'use server'

  const headers = await getHeaders()
  const protocol = headers.get('x-forwarded-proto') ?? 'http'
  const host = headers.get('x-forwarded-host') ?? headers.get('host')

  if (host) {
    await fetch(`${protocol}://${host}/api/users/logout`, {
      method: 'POST',
      headers: {
        cookie: headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    })
  }

  redirect('/')
}
