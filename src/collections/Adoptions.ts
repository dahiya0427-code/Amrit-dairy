import type { CollectionConfig } from 'payload'
import { admins, adminsOrManagers } from '@/access'

/** People who signed up on /adopt-a-cow. Created only by /api/adopt; the team follows up from here. */
export const Adoptions: CollectionConfig = {
  slug: 'adoptions',
  labels: { singular: 'Cow adoption', plural: 'Cow adoptions' },
  admin: {
    useAsTitle: 'name',
    group: 'Farm',
    defaultColumns: ['name', 'phone', 'plan', 'cow', 'status', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'email'],
    description: 'Adopt-a-cow sign-ups. Contact them on WhatsApp with payment details, then set the status to Active.',
  },
  access: { read: adminsOrManagers, create: () => false, update: adminsOrManagers, delete: admins },
  defaultSort: '-createdAt',
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'phone', type: 'text', required: true },
      { name: 'email', type: 'email' },
      { name: 'city', type: 'text' },
    ] },
    { type: 'row', fields: [
      { name: 'plan', type: 'relationship', relationTo: 'adoption-plans' },
      { name: 'planSnapshot', label: 'Plan at sign-up', type: 'text', admin: { readOnly: true, description: 'Name and price when they signed up.' } },
      { name: 'cow', label: 'Cow chosen', type: 'text' },
    ] },
    { type: 'row', fields: [
      { name: 'isGift', label: 'It’s a gift', type: 'checkbox' },
      { name: 'giftFor', label: 'Gift for', type: 'text' },
      { name: 'occasion', type: 'text' },
    ] },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Active (paying)', value: 'active' },
        { label: 'Ended', value: 'ended' },
      ],
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar', description: 'Only visible to the team.' } },
    { name: 'locale', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
}
