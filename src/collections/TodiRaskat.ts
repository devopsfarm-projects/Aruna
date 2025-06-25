import type { CollectionConfig } from 'payload'

export const TodiRaskat: CollectionConfig = {
  slug: 'TodiRaskat',
  admin: {
    useAsTitle: 'BlockType',
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
    { name: 'BlockType', label: 'Block Type', type: 'select', required: true, options: ['Brown', 'White'], },
    { name: 'date', label: 'Date', type: 'date', defaultValue: () => new Date(), },
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'vendor' },
    { name: 'munim', label: 'Munim', type: 'text' },
    { name: 'l', label: 'Length (लम्बाई)', type: 'number', required: true, min: 1, },
    { name: 'b', label: 'Breadth (चौड़ाई)', type: 'number', min: 1, },
    { name: 'h', label: 'Height (ऊंचाई)', type: 'number', min: 1, },
    { name: 'todiraskat_cost', label: 'Todi Raskat Cost', type: 'number' },
    { name: 'hydra_cost', label: 'Hydra Cost', type: 'number' },
    { name: 'truck_cost', label: 'Truck Cost', type: 'number' },
    { name: 'total_todiraskat_area', label: 'Total Todi Raskat Area', type: 'number' },
    { name: 'total_todiraskat_cost', label: 'Total Todi Raskat Cost', type: 'number' },
    { name: 'estimate_cost', label: 'Estimate Cost', type: 'number' },
    { name: 'depreciation', label: 'Depreciation', type: 'number' },
    { name: 'final_cost', label: 'Final Cost', type: 'number' },
    { name: 'group', label: 'Group Details', type: 'array', fields: [
      { name: 'date', label: 'Date', type: 'date', defaultValue: () => new Date(), },
      { name: 'hydra_cost', label: 'Hydra Cost', type: 'number' },
      { name: 'truck_cost', label: 'Truck Cost', type: 'number' },
      { name: 'total_block_area', label: 'Total Block Area', type: 'number' },
      { name: 'total_block_cost', label: 'Total Block Cost', type: 'number' },
      { name: 'remaining_amount', label: 'Remaining Amount', type: 'number' },
      { name: 'block', label: 'Add Block', type: 'array', fields: [
        {
          name: 'addmeasures',
          label: 'Add Measures',
          type: 'array',
          fields: [
            { name: 'l', label: 'Length (लम्बाई)', type: 'number', min: 1 },
            { name: 'b', label: 'Breadth (चौड़ाई)', type: 'number', min: 1 },
            { name: 'h', label: 'Height (ऊंचाई)', type: 'number', min: 1 },
            { name: 'block_area', label: 'Block Area', type: 'number' },
            { name: 'block_cost', label: 'Block Cost', type: 'number' },
          ],
        },
      ],
      },
    ],
    },

    { name: 'createdBy', label: 'Created By (Client)', type: 'relationship', relationTo: 'users',
      access: {
        create: () => true,
        update: ({ req: { user } }) => user?.role === 'owner',
      },
      admin: {
        condition: ({ user }) => user?.role === 'owner' || user?.role === 'sites-visitor',
      },
    },
  ],
}
