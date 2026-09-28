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
import { Offers } from './collections/Offers'
import { Coupons } from './collections/Coupons'
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

// Vercel Blob token for image uploads. The store may be connected with the "MEDIA" prefix
// (MEDIA_READ_WRITE_TOKEN) when the project already had a BLOB_READ_WRITE_TOKEN.
const blobToken = process.env.MEDIA_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || ''

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // empty = same address the admin is opened on, so it works on any domain
  serverURL: '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Amrit Dairy Admin' },
    components: {
      views: {
        priceList: { Component: '/components/admin/PriceList#PriceListView', path: '/price-list' },
      },
      afterNavLinks: ['/components/admin/PriceListNavLink#PriceListNavLink'],
    },
  },
  collections: [
    Products,
    Categories,
    Orders,
    Offers,
    Coupons,
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
      enabled: Boolean(blobToken),
      collections: { media: true },
      token: blobToken,
    }),
  ],
})
