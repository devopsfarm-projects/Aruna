import type { CollectionConfig } from 'payload'

export const Block: CollectionConfig = {
  slug: 'Block',
  admin: {
    useAsTitle: 'vender_id',
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
      name: 'BlockType',
      label: 'Block Type',
      type: 'select',
      required: true,
      options: ['Brown', 'White'],
    },

    { name: 'date', label: 'Date', type: 'date' },
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'accounts' },
    { name: 'mines', label: 'Mines', type: 'relationship', relationTo: 'Mines' },
    { name: 'qty', label: 'Quantity', type: 'number' },

    {
      name: 'todi',
      label: 'Add Todi',
      type: 'array',
      fields: [
        { name: 'todicost', label: 'Todi Cost', type: 'number' },
        {
          name: 'addmeasures',
          label: 'Add Measures',
          type: 'array',
          fields: [
            { name: 'l', label: 'L', type: 'number' },
            { name: 'b', label: 'B', type: 'number' },
            { name: 'h', label: 'H', type: 'number' },
  
          ],
        },
      ],
    },
    { name: 'total_quantity', label: 'Total Quantity', type: 'number' },
    { name: 'issued_quantity', label: 'Issued Quantity', type: 'number' },
    { name: 'left_quantity', label: 'Left Quantity', type: 'number' },
    { name: 'final_total', label: 'Final Total', type: 'number' },
    { name: 'partyRemainingPayment', label: 'Party Remaining Payment', type: 'number' },
    { name: 'partyAdvancePayment', label: 'Party Advance Payment', type: 'number' },

    {
      name: 'transportType',
      label: 'Transport Type',
      type: 'select',
      options: ['Hydra', 'Truck'],
    },

    {
      name: 'createdBy',
      label: 'Created By (Client)',
      type: 'relationship',
      relationTo: 'users',
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
      ({ data }) => {
        let finalTotal = 0;
        const qty = data.qty || 0;
  
        if (Array.isArray(data.todi)) {
          for (const todiItem of data.todi) {
            const todicost = todiItem.todicost || 0;
  
            if (Array.isArray(todiItem.addmeasures)) {
              for (const item of todiItem.addmeasures) {
                const l = item.l || 0;
                const b = item.b || 0;
                const h = item.h || 0;
                const rate = item.rate || 1; 
  
                finalTotal += l * b * h * qty * rate * todicost;
              }
            }
          }
        }
  
        const partyAdvance = data.partyAdvancePayment || 0;
        const partyRemaining = finalTotal - partyAdvance;
  
        return {
          ...data,
          final_total: finalTotal,
          partyRemainingPayment: partyRemaining,
        };
      },
    ],
  },
  
}
