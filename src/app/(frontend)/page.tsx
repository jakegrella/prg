import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { login } from '@payloadcms/next/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'

async function handleLogIn(formData: FormData) {
  'use server'

  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    redirect('/?error=invalid-credentials')
  }

  try {
    await login({
      collection: 'users',
      config,
      email,
      password,
    })
  } catch {
    redirect('/?error=invalid-credentials')
  }

  redirect('/staff-portal')
}

type HomePageProps = {
  searchParams?: Promise<{
    error?: string
    display?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const error = resolvedSearchParams?.error
  const display = resolvedSearchParams?.display ?? 'staff'

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const userLoggedIn = !!user

  return (
    <main className="home">
      <div className="left">
        <h1>Pappas Restaurant Group</h1>
        <nav>
          <ul>
            <li>
              <Link href="/?display=concepts" className={display === 'concepts' ? 'underline' : ''}>
                Concepts
              </Link>
            </li>
            <li>
              <Link href="/?display=about" className={display === 'about' ? 'underline' : ''}>
                About
              </Link>
            </li>
            <li>
              {userLoggedIn ? (
                <Link href="/staff-portal">Staff Portal</Link>
              ) : (
                <Link href="/?display=staff" className={display === 'staff' ? 'underline' : ''}>
                  Staff Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {display === 'concepts' && (
        <div className="right">
          <ul>
            <li>BACKWATERS NORTH REDINGTON BEACH</li>
            <li>BACKWATERS ON SAND KEY</li>
            <li>PAPPY'S</li>
            <li>TAVERN IN THE GREEN</li>
            <li>TAVERN ON THE BLUFFS</li>
          </ul>
        </div>
      )}
      {display === 'about' && (
        <div className="right">
          <p>
            PAPPAS RESTAURANT GROUP WAS CREATED Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Mauris sollicitudin magna et ligula varius vehicula. In interdum semper est, ac
            sollicitudin elit. Mauris fermentum sapien et accumsan laoreet. Ut mattis elementum
            urna, nec scelerisque orci dignissim in. Praesent eu rutrum sapien. Nulla magna magna,
            eleifend non magna quis, suscipit lacinia nunc.
          </p>
        </div>
      )}
      {display === 'staff' && !userLoggedIn && (
        <div className="right">
          {error === 'invalid-credentials' && (
            <p role="alert" aria-live="polite">
              Invalid email or password.
            </p>
          )}
          <form action={handleLogIn}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      )}
    </main>
  )
}
