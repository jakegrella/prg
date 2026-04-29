import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import handleLogOut from '@/lib/handleLogout'
import { JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import './styles.css'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  if (!user) redirect('/')

  const { docs: pages } = await payload.find({
    collection: 'pages',
    depth: 2,
    overrideAccess: false,
    user,
    where: {
      'settings.slug': {
        equals: slug,
      },
    },
  })
  if (pages.length === 0) redirect('/staff-portal') // redirect if no page found with that slug
  const page = pages[0]

  const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    upload: ({ node }) => {
      const media = node?.value as
        | {
            alt?: string | null
            mimeType?: string | null
            thumbnailURL?: string | null
            url?: string | null
          }
        | undefined
      console.log('media', media)

      const src = media?.url
      console.log('src', src)
      const mimeType = media?.mimeType

      if (!src || !mimeType?.startsWith('video/')) {
        return null
      }

      return (
        <video controls playsInline preload="metadata" poster={media.thumbnailURL ?? undefined}>
          <source src={src} type={mimeType} />
          {media.alt ?? 'Your browser does not support the video tag.'}
        </video>
      )
    },
  })

  return (
    <main className="page">
      <div className="top">
        <div className="top-left">
          <h1>Pappas Restaurant Group</h1>
          <p>Welcome, {user.nickname ?? user.firstName}.</p>
        </div>
        <div className="top-right">
          {user.roles.includes('admin') && (
            <Button render={<Link href="/admin" />} nativeButton={false}>
              Admin Panel
            </Button>
          )}
          <form action={handleLogOut}>
            <Button type="submit" variant="secondary">
              log out
            </Button>
          </form>
        </div>
      </div>
      <div className="bottom">
        <h2>{page.title}</h2>
        {page.content ? <RichText converters={jsxConverters} data={page.content} /> : null}
      </div>
    </main>
  )
}
