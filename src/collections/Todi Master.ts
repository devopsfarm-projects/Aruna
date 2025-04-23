import type { CollectionConfig } from 'payload'

export const TodiMaster: CollectionConfig = {
  slug: 'Todi-Master',
  admin: {
    useAsTitle: 'partyName',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'owner' || user?.role === 'sites-visitor',

    delete: ({ req: { user } }) => user?.role === 'owner',

    update: ({ req: { user } }) => user?.role === 'owner' || user?.role === 'sites-visitor',


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
        create: () => true,
        update: ({ req: { user } }) => user?.role === 'owner',
      },
      admin: {
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
