import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { ServiceAreas } from './collections/ServiceAreas'
import { Orders } from './collections/Orders'
import { Leads } from './collections/Leads'
import { Testimonials } from './collections/Testimonials'
import { Breeds } from './collections/Breeds'
import { Departments } from './collections/Departments'
import { Facilities } from './collections/Facilities'
import { Posts } from './collections/Posts'
import { Ticker } from './collections/Ticker'
import { FAQs } from './collections/FAQs'
import { LegalPages } from './collections/LegalPages'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Amrit Dairy Admin' },
  },
  collections: [
    Products,
    Categories,
    Orders,
    Leads,
    ServiceAreas,
    Testimonials,
    Breeds,
    Departments,
    Facilities,
    Posts,
    Ticker,
    FAQs,
    LegalPages,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'हिंदी (Hindi)', code: 'hi' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Production (Vercel + Neon) applies committed migrations on start-up.
    prodMigrations: migrations,
  }),
  sharp,
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'orders@mail.amritdairy.in',
        defaultFromName: 'Amrit Dairy',
      })
    : undefined,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
