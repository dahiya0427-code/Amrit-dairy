import type { GlobalConfig } from 'payload'
import { admins, anyone } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: admins },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business details',
          fields: [
            { name: 'ordersPhone', type: 'text', required: true, defaultValue: '+91 77000 04877' },
            { name: 'cowPhone', type: 'text', required: true, defaultValue: '+91 80595 93666' },
            { name: 'email', type: 'email', required: true, defaultValue: 'contact@amritdairy.in' },
            {
              name: 'address',
              type: 'textarea',
              required: true,
              localized: true,
              defaultValue: 'Amrit Dairy, Near Anup Sports Village, Rajhbhaya, Garhi Brahmnan, Sonipat, Haryana - 131001',
            },
            { name: 'mapsUrl', type: 'text', defaultValue: 'https://maps.google.com/?q=Amrit+Dairy+Garhi+Brahmnan+Sonipat' },
            { type: 'row', fields: [
              { name: 'gstin', type: 'text', defaultValue: '06CKFPC6104C1ZW' },
              { name: 'fssai', type: 'text', defaultValue: '10826020000285' },
              { name: 'udyam', type: 'text', defaultValue: 'UDYAM-HR-18-0074290' },
            ] },
            { name: 'grievanceOfficer', type: 'text', admin: { description: 'Name shown on the grievance redressal page (E-Commerce Rules 2020).' } },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'youtube', type: 'text' },
          ],
        },
        {
          label: 'Checkout & delivery',
          fields: [
            { type: 'row', fields: [
              { name: 'freeDeliveryThreshold', type: 'number', defaultValue: 999, admin: { description: '₹. Orders at or above this ship free.' } },
              { name: 'localDeliveryFee', type: 'number', defaultValue: 30, admin: { description: '₹ fee for local delivery below the threshold.' } },
              { name: 'shippingFee', type: 'number', defaultValue: 99, admin: { description: '₹ courier fee below the threshold.' } },
            ] },
            { name: 'cutoffTime', type: 'text', defaultValue: '9 PM', localized: true, admin: { description: 'Order before this time for next-morning delivery.' } },
          ],
        },
      ],
    },
  ],
}
