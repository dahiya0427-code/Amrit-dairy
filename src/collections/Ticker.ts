import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Ticker: CollectionConfig = {
  slug: 'ticker',
  labels: { singular: 'Ticker / news item', plural: 'Ticker & news' },
  admin: {
    useAsTitle: 'text',
    group: 'Content',
    defaultColumns: ['text', 'type', 'active', 'startAt', 'endAt'],
    description: 'Short announcements shown in the scrolling bar at the top of every page and on /news.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: '-priority',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'text', type: 'text', required: true, localized: true, maxLength: 110 },
    { name: 'details', type: 'textarea', localized: true, admin: { description: 'Optional longer text for the /news page.' } },
    { name: 'link', type: 'text', admin: { description: 'Optional, e.g. /products/desi-cow-golden-ghee' } },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'notice',
      options: [
        { label: 'Offer', value: 'offer' },
        { label: 'New area', value: 'area' },
        { label: 'Product launch', value: 'launch' },
        { label: 'Event', value: 'event' },
        { label: 'Notice', value: 'notice' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'priority', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Higher shows first.' } },
    { name: 'startAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'endAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
