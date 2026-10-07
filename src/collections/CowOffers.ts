import type { CollectionConfig } from 'payload'
import { admins, adminsOrManagers } from '@/access'
import { CALF, LABELS, MILKING_STATUS, TRANSPORT, VACCINES, YES_NO_UNKNOWN } from '@/lib/cow-offer'

const opts = <T extends string>(values: readonly T[], labels: Record<T, string>) => values.map((value) => ({ value, label: labels[value] }))

/**
 * Cows people offer to sell to the farm, sent from the "Sell your cow" form on
 * /desi-cows. Created only by /api/sell-cow; staff follow up from here.
 */
export const CowOffers: CollectionConfig = {
  slug: 'cow-offers',
  labels: { singular: 'Cow offer', plural: 'Cow offers' },
  admin: {
    useAsTitle: 'title',
    group: 'Farm',
    defaultColumns: ['title', 'phone', 'expectedPrice', 'status', 'createdAt'],
    listSearchableFields: ['title', 'phone'],
    description: 'Cows offered to us through the "Sell your cow" form. Photos and videos are at the top of each offer.',
  },
  access: { read: adminsOrManagers, create: () => false, update: adminsOrManagers, delete: admins },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data }) => {
        const breed = data.cow?.breed === 'other' ? data.cow?.breedOther || 'Other breed' : data.cow?.breed
        data.title = [breed, data.seller?.name, data.seller?.village].filter(Boolean).join(' · ')
        data.phone = data.seller?.phone
        data.expectedPrice = data.sale?.expectedPrice ?? null
        return data
      },
    ],
    // deleting an offer deletes its photos and videos
    afterDelete: [
      async ({ doc, req }) => {
        await req.payload.delete({ collection: 'cow-offer-files', where: { offer: { equals: doc.id } }, req, overrideAccess: true })
      },
    ],
  },
  fields: [
    { name: 'files', type: 'ui', admin: { components: { Field: '/components/admin/CowOfferFiles#CowOfferFiles' } } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Visit planned', value: 'visit' },
        { label: 'Bought', value: 'bought' },
        { label: 'Not interested', value: 'rejected' },
      ],
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar', description: 'Only visible to the team.' } },
    { name: 'locale', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    // flattened copies for the list view and search
    { name: 'title', type: 'text', admin: { hidden: true } },
    { name: 'phone', type: 'text', admin: { hidden: true } },
    { name: 'expectedPrice', type: 'number', admin: { hidden: true } },
    {
      name: 'seller',
      label: 'Seller',
      type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'phone', type: 'text', required: true },
          { name: 'whatsapp', type: 'text' },
          { name: 'email', type: 'email' },
        ] },
        { type: 'row', fields: [
          { name: 'village', label: 'Village / town', type: 'text', required: true },
          { name: 'district', type: 'text' },
          { name: 'state', type: 'text' },
          { name: 'pincode', type: 'text' },
        ] },
      ],
    },
    {
      name: 'cow',
      label: 'The cow',
      type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'breed', type: 'text', required: true },
          { name: 'breedOther', label: 'Breed (other)', type: 'text' },
          { name: 'ageYears', label: 'Age (years)', type: 'number' },
          { name: 'calvings', label: 'Number of calvings', type: 'number' },
        ] },
        { type: 'row', fields: [
          { name: 'milkingStatus', type: 'select', options: opts(MILKING_STATUS, LABELS.milkingStatus) },
          { name: 'milkPerDay', label: 'Milk per day (litres)', type: 'number' },
          { name: 'lastCalving', label: 'Last calving', type: 'text' },
        ] },
        { type: 'row', fields: [
          { name: 'pregnant', type: 'select', options: opts(YES_NO_UNKNOWN, LABELS.yesNo) },
          { name: 'pregnantMonths', label: 'Months pregnant', type: 'number' },
          { name: 'calf', label: 'Calf with her', type: 'select', options: opts(CALF, LABELS.calf) },
        ] },
        { type: 'row', fields: [
          { name: 'colour', type: 'text' },
          { name: 'tagNumber', label: 'Ear tag / ID', type: 'text' },
          { name: 'papers', label: 'Pedigree / papers', type: 'select', options: opts(YES_NO_UNKNOWN, LABELS.yesNo) },
        ] },
      ],
    },
    {
      name: 'health',
      type: 'group',
      fields: [
        { name: 'vaccinations', type: 'select', hasMany: true, options: opts(VACCINES, LABELS.vaccines) },
        { name: 'dewormed', label: 'Dewormed recently', type: 'select', options: opts(YES_NO_UNKNOWN, LABELS.yesNo) },
        { name: 'notes', label: 'Health, illness or injuries', type: 'textarea' },
      ],
    },
    {
      name: 'sale',
      type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'expectedPrice', label: 'Expected price (₹)', type: 'number' },
          { name: 'negotiable', type: 'checkbox' },
          { name: 'availableFrom', type: 'text' },
          { name: 'transport', type: 'select', options: opts(TRANSPORT, LABELS.transport) },
        ] },
        { name: 'reason', label: 'Reason for selling', type: 'textarea' },
      ],
    },
    { name: 'notes', label: 'Anything else from the seller', type: 'textarea' },
  ],
}
