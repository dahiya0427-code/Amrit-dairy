import { withPayload } from '@payloadcms/next/withPayload'

// 301s from the old Shopify store (Doc 05 §3). Add product handles here if a slug changes.
const shopifyRedirects = [
  { source: '/collections/all', destination: '/shop' },
  { source: '/collections/:handle/products/:product', destination: '/products/:product' },
  { source: '/collections/:handle', destination: '/shop' },
  { source: '/pages/contact', destination: '/contact' },
  { source: '/pages/farm-story', destination: '/farm-story' },
  { source: '/pages/our-farm', destination: '/farm-story' },
  { source: '/pages/desi-cows', destination: '/desi-cows' },
  { source: '/pages/:page', destination: '/' },
  { source: '/policies/privacy-policy', destination: '/legal/privacy-policy' },
  { source: '/policies/refund-policy', destination: '/legal/refund-policy' },
  { source: '/policies/terms-of-service', destination: '/legal/terms-of-service' },
  { source: '/policies/shipping-policy', destination: '/legal/shipping-policy' },
  { source: '/blogs/:blog/:post', destination: '/blog/:post' },
  { source: '/blogs/:blog', destination: '/blog' },
  { source: '/resources', destination: '/blog' },
].map((r) => ({ ...r, permanent: true }))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async redirects() {
    return shopifyRedirects
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
