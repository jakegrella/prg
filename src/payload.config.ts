import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // livePreview: {
    //   url: ({ data, collectionConfig }) => {
    //     // console.log('data', data)
    //     // console.log('collectionConfig', collectionConfig)
    //     return `http://localhost:3000${collectionConfig?.slug === 'pages' ? `/${data?.slug}` : ''}`
    //   },
    //   collections: [Pages.slug],
    // },
  },
  collections: [Users, Media, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
  }),
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seed.ts'),
      key: 'seed',
    },
  ],
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: 'public',
    }),
  ],
})
