import type { CollectionConfig } from 'payload'
import { admins, adminsFieldLevel, loggedIn } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Staff user', plural: 'Staff users' },
  auth: true,
  admin: { useAsTitle: 'email', group: 'Settings', defaultColumns: ['name', 'email', 'role'] },
  access: {
    read: loggedIn,
    create: admins,
    update: ({ req: { user }, id }) => Boolean(user && (user.role === 'admin' || user.id === id)),
    delete: admins,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      access: { update: adminsFieldLevel },
      options: [
        { label: 'Admin (everything)', value: 'admin' },
        { label: 'Store manager (orders, products, leads)', value: 'manager' },
        { label: 'Content editor (blog, pages, ticker)', value: 'editor' },
      ],
    },
  ],
}
