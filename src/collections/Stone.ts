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
    {name: 'vender_id',label: 'Vendor Id',type: 'relationship',relationTo: 'vendor',},
    {name: 'mines',label: 'Mines',type: 'relationship',relationTo: 'Mines',},

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
    { name: 'rate', label: 'Rate', type: 'number' },
    { name: 'total_quantity', label: 'Total Quantity', type: 'number' },
    { name: 'issued_quantity', label: 'Issued Quantity', type: 'number' },
    { name: 'left_quantity', label: 'Left Quantity', type: 'number' },
    { name: 'block_amount', label: 'Block Amount', type: 'number' }, // block_amount = total_quantity*(rate((lxbxh)+(lxbxh)+(lxbxh).....))
    { name: 'labour_name', label: 'Labour Name', type: 'text' },
    { name: 'transportType', label: 'Transport Type', type: 'select', options: ['Hydra', 'Truck'] },
    { name: 'vehicle_number', label: 'Vehicle Number', type: 'text' },
    { name: 'vehicle_cost', label: 'Vehicle Cost', type: 'number' },
    { name: 'total_amount', label: 'Total Amount', type: 'number' }, // total_amount = block_amount + vehicle_cost

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
        let blockAmount = 0;
        let finalTotal = 0;
        let totalAmount = 0;

        // Calculate block amount based on total_quantity and measures
        if (Array.isArray(data.addmeasures) && data.total_quantity) {
              // Calculate total volume and apply rate for each measure
          blockAmount = data.addmeasures.reduce((sum, item) => {
            const l = item.l || 0;
            const b = item.b || 0;
            const h = item.h || 0;
            const rate = data.rate || 0;
            const volume = l * b * h;
            return sum + (data.issued_quantity * rate * volume);
          }, 0);
          
          finalTotal = blockAmount;
        }

        // Calculate total amount
        const vehicleCost = data.vehicle_cost || 0;
        totalAmount = blockAmount + vehicleCost;

        return {
          ...data,
          block_amount: blockAmount,
          final_total: finalTotal,
          total_amount: totalAmount,
        };
      },
    ],
  },
}
