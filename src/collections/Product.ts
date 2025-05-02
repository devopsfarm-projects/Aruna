import type { CollectionConfig } from 'payload'

export const Product: CollectionConfig = {
  slug: 'product',
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
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'accounts'  },
    // { name: 'mines', label: 'Mines', type: 'relationship', relationTo: 'Mines' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'bill', label: 'Bill No.', type: 'text' },
    
    {
      name: 'mainType',
      label: 'Main Type',
      type: 'select',
      required: true,
      options: ['Stone', 'Block'],
    },
    {
      name: 'stoneOptions',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData.mainType === 'Stone',
      },
      fields: [
        {
          name: 'subType',
          label: 'Stone Sub Type',
          type: 'select',
          options: [
            { label: 'Khanda', value: 'khanda' },
            { label: 'Raskat', value: 'raskat' },
          ],
        },
      ],
    },
    {
      name: 'blockOptions',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData.mainType === 'Block',
      },
      fields: [
        {
          name: 'subType',
          label: 'Block Sub Type',
          type: 'select',
          options: [
            { label: 'Brown', value: 'brown' },
            { label: 'White', value: 'white' },
          ],
        },
      ],
    },

    {
      name: 'addforward',
      label: 'Add Forward',
      type: 'array',
      fields: [
        { name: 'l', label: 'L', type: 'number' },
        { name: 'w', label: 'W', type: 'number' },
        { name: 'h', label: 'H', type: 'number' },
        { name: 'qty', label: 'Qty', type: 'number' },
        {
            name: 'labour',
            type: 'relationship',
            relationTo: 'labour',
        },
      ],
    },
    {
      name: 'statement',
      label: 'Statement',
      type: 'group', 
      fields: [
        { name: 'bill', label: 'Bill No.', type: 'text'},
        { name: 'date', label: 'Date', type: 'date' },
        {
          name: 'thodi',
          label: 'Todi',
          type: 'array',
          fields: [
            { name: 'thodi', label: 'Todi', type: 'text' },
          ],
        },
        { name: 'hydra', label: 'hydra', type: 'relationship', relationTo: 'truck' },
        { name: 'quantity', label: 'Quantity', type: 'text' },
        { name: 'total_amount', label: 'Total Amount', type: 'text' },
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
  
        if (Array.isArray(data.addforward)) {
          finalTotal = data.addforward.reduce((sum, item) => {
            const l = item.l || 0;
            const w = item.w || 0;
            const h = item.h || 0;
            const qty = item.qty || 0;
            return sum + (l * w * h * qty);
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
