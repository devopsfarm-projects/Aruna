import type { CollectionConfig } from 'payload'

export const Stone: CollectionConfig = {
  slug: 'stone',
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
      name: 'stoneType',
      label: 'Stone Type',
      type: 'select',
      required: true,
      options: ['Khanda', 'Raskat'],
    },

    { name: 'date', label: 'Date', type: 'date' },
    {
      name: 'vender_id',
      label: 'Vendor Id',
      type: 'relationship',
      relationTo: 'vendor',
    },
    {
      name: 'mines',
      label: 'Mines',
      type: 'relationship',
      relationTo: 'Mines',
    },

    {
      name: 'addmeasures',
      label: 'Add Measures',
      type: 'array',
      fields: [
        { name: 'qty', label: 'Quantity', type: 'number' },
        { name: 'l', label: 'L', type: 'number' },
        { name: 'b', label: 'B', type: 'number' },
        { name: 'h', label: 'H', type: 'number' },
        { name: 'rate', label: 'Rate', type: 'number' },
        { name: 'labour', type: 'relationship', relationTo: 'labour'},
        { name: 'hydra', label: 'hydra', type: 'relationship', relationTo: 'truck' },
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
  
        if (Array.isArray(data.addmeasures)) {
          finalTotal = data.addmeasures.reduce((sum, item) => {
            const l = item.l || 0;
            const b = item.b || 0;
            const h = item.h || 0;
            const qty = item.qty || 0;
            const rate = item.rate || 0;
            return sum + (l * b * h * qty*rate);
          }, 0);
        }
  
        const partyAdvance = data.partyAdvancePayment || 0;
        const partyRemaining = finalTotal - partyAdvance;
  
        return {
          ...data,
          final_total: finalTotal.toString(), 
          partyRemainingPayment: partyRemaining,
        };
      },
    ],
  },
}
