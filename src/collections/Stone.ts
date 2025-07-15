import type { CollectionConfig } from 'payload'

export interface Stone {
  munim: string | number | readonly string[] | undefined
  id: string
  stoneType: 'Khanda' | 'Gudiya'
  date: string
  rate: number
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  minum: string
  hydra_cost: number
  total_amount: number
  createdBy: {
    id: string
    email: string
    role: string
  }
}

export const Stone: CollectionConfig = {
  slug: 'stone',
  admin: {
    useAsTitle: 'munim',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager' || user?.role === 'user',
    delete: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'manager',
    read: async ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager' || user.role === 'user') return true
      if (user.role === 'user') {
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
      name: 'stoneType',
      label: 'Stone Type',
      type: 'select',
      required: true,
      options: ['Khanda', 'Gudiya'],
    },

    { name: 'date', label: 'Date', type: 'date' },
    { name: 'rate', label: 'Rate', type: 'number' },
    { name: 'total_quantity', label: 'Total Quantity', type: 'number' },
    { name: 'issued_quantity', label: 'Issued Quantity', type: 'number' },
    { name: 'left_quantity', label: 'Left Quantity', type: 'number' },
    { name: 'munim', label: 'munim', type: 'text' },
    { name: 'hydra_cost', label: 'Hydra Cost', type: 'number' },
    { name: 'total_amount', label: 'Total Amount', type: 'number' }, // total_amount = block_amount + vehicle_cost

    {
      name: 'createdBy',
      label: 'Created By (Client)',
      type: 'relationship',
      relationTo: 'users',
      access: {
        create: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        condition: ({ user }) => user?.role === 'admin' || user?.role === 'sites-visitor',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        let blockAmount = 0
        let totalAmount = 0

        // Calculate block amount based on total_quantity and rate
        if (data.total_quantity && data.rate) {
          blockAmount = data.total_quantity * data.rate
        }

        // Calculate total amount
        const hydraCost = data.hydra_cost || 0
        totalAmount = blockAmount * hydraCost

        return {
          ...data,
          total_amount: totalAmount,
        }
      },
    ],
  },
}
