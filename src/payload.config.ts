import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MediaFiles } from './collections/MediaFiles'
import { dbStorage } from './storage/db-storage'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { ServiceAreas } from './collections/ServiceAreas'
import { Orders } from './collections/Orders'
import { Offers } from './collections/Offers'
import { Coupons } from './collections/Coupons'
import { Leads } from './collections/Leads'
import { CowOffers } from './collections/CowOffers'
import { CowOfferFiles } from './collections/CowOfferFiles'
import { CowOfferChunks } from './collections/CowOfferChunks'
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
    CowOffers,
    CowOfferFiles,
    CowOfferChunks,
    Departments,
    Facilities,
    Posts,
    Ticker,
    FAQs,
    LegalPages,
    Media,
    MediaFiles,
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
    // Uploaded images are stored in the database, so no separate file storage is needed
    cloudStoragePlugin({
      collections: { media: { adapter: dbStorage } },
    }),
  ],
})
