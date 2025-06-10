import type { CollectionConfig } from 'payload'

export const Block: CollectionConfig = {
  slug: 'Block',
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
    {
      name: 'BlockType',
      label: 'Block Type',
      type: 'select',
      required: true,
      options: ['Brown', 'White'],
    },

    {
      name: 'date',
      label: 'Date',
      type: 'date',
      defaultValue: () => new Date(),
    },
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'vendor' },
    { name: 'munim', label: 'Munim', type: 'text' },
    { name: 'total_cost', label: 'Total Cost', type: 'number' },
    { name: 'hydra_cost', label: 'Hydra Cost', type: 'number' },
    { name: 'truck_cost', label: 'Truck Cost', type: 'number' },
    { name: 'todirate', label: 'Todi Rate', type: 'number' },
    { name: 'total_quantity', label: 'Total Quantity', type: 'number' },
    { name: 'issued_quantity', label: 'Issued Quantity', type: 'number' },
    { name: 'left_quantity', label: 'Left Quantity', type: 'number' },
    { name: 'final_total', label: 'Final Total', type: 'number' },

    {
      name: 'front_l',
      label: 'Front Length (लम्बाई)',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'front_b',
      label: 'Front Breadth (चौड़ाई)',
      type: 'number',

      min: 1,
    },
    {
      name: 'front_h',
      label: 'Front Height (ऊंचाई)',
      type: 'number',

      min: 1,
    },

    // Back Side Measurements
    {
      name: 'back_l',
      label: 'Back Length (लम्बाई)',
      type: 'number',

      min: 1,
    },
    {
      name: 'back_b',
      label: 'Back Breadth (चौड़ाई)',
      type: 'number',

      min: 1,
    },
    {
      name: 'back_h',
      label: 'Back Height (ऊंचाई)',
      type: 'number',

      min: 1,
    },

    { name: 'total_area', label: 'Total Area', type: 'number' },
    { name: 'total_todi_cost', label: 'Total Todi Cost', type: 'number' },

    {
      name: 'block',
      label: 'Add Block',
      type: 'array',
      fields: [
        {
          name: 'addmeasures',
          label: 'Add Measures',
          type: 'array',
          fields: [
            { name: 'l', label: 'Length (लम्बाई)', type: 'number', min: 1 },
            { name: 'b', label: 'Breadth (चौड़ाई)', type: 'number', min: 1 },
            { name: 'h', label: 'Height (ऊंचाई)', type: 'number', min: 1 },
            { name: 'black_area', label: 'Black Area', type: 'number' },
            { name: 'black_cost', label: 'Black Cost', type: 'number' },
          ],
        },
      ],
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
}
