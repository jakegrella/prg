import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import './styles.css'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import handleLogOut from '@/lib/handleLogout'

export default async function StaffPortalPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  if (!user) redirect('/')

  const { docs: pages } = await payload.find({
    collection: 'pages',
    depth: 2,
    // page: 1,
    // limit: 10,
    // pagination: false, // If you want to disable pagination count, etc.
    // where: {}, // pass a `where` query here
    // sort: '-title',
    overrideAccess: false,
    user,
    showHiddenFields: true,
  })
  console.log('pages', pages)

  return (
    <main className="portal">
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
        <h2>Pages</h2>
        {user.roles.includes('admin') ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="p-0">
                    <Link
                      href={`/staff-portal/pages/${page.settings.slug}`}
                      className="block w-full px-2 py-2"
                    >
                      {page.title}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/staff-portal/pages/${page.settings.slug}`}
                      className="block w-full px-2 py-2"
                    >
                      {page.settings.audience}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/staff-portal/pages/${page.settings.slug}`}
                      className="block w-full px-2 py-2"
                    >
                      <Badge variant={page.settings.status === 'draft' ? 'secondary' : 'default'}>
                        {page.settings.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  {/* <TableCell className="p-0">
                    <Link href={`/staff-portal/pages/${page.settings.slug}`} className="block w-full px-2 py-2">
                      View
                    </Link>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="p-0">
                    <Link
                      href={`/staff-portal/pages/${page.settings.slug}`}
                      className="block w-full px-2 py-2"
                    >
                      {page.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  )
}
