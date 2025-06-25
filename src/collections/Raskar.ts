import type { CollectionConfig } from 'payload'

export const Raskar: CollectionConfig = {
  slug: 'Raskar',
  admin: {
    useAsTitle: 'partyName',
  },
  access: {
    // Only owners and sites-visitors can create
    create: ({ req: { user } }) => user?.role === 'owner' || user?.role === 'sites-visitor',

    // Only allow owners to delete
    delete: ({ req: { user } }) => user?.role === 'owner',

    // Allow update by owner and sites-visitor
    update: ({ req: { user } }) => user?.role === 'owner' || user?.role === 'sites-visitor',

    // Read logic:
    // - owner sees all
    // - sites-visitor sees all
    // - client sees only records where `createdBy` = user's id
    read: async ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'owner' || user.role === 'sites-visitor') return true
      if (user.role === 'client') {
        return {
          createdBy: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'partyName',
      label: 'Party Name',
      type: 'text',
      required: true,
    },
    {
      name: 'partyAdvancePayment',
      label: 'Party Advance Payment',
      type: 'number',
      required: true,
    },
    {
      name: 'partyRemainingPayment',
      label: 'Party Remaining Payment',
      type: 'number',
      required: true,
    },
    {
      name: 'stoneTotalPayment',
      label: 'Stone Total Payment',
      type: 'number',
      required: true,
    },
    {
      name: 'createdBy',
      label: 'Created By (Client)',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        create: () => true, // Allow all to create, but limit UI and hooks decide behavior
        update: ({ req: { user } }) => user?.role === 'owner',
      },
      admin: {
        // Show the dropdown only to owners and sites-visitors
        condition: ({ user }) => user?.role === 'owner' || user?.role === 'sites-visitor',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user?.role === 'client') {
          return {
            ...data,
            createdBy: req.user.id,
          }
        }
        return data
      },
    ],
  },
}
