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
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'vendor' },
    { name: 'mines', label: 'Mines', type: 'relationship', relationTo: 'Mines' },
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

    { name: 'block_amount', label: 'Block Amount', type: 'number' }, // block_amount = todi1((lxbxh)+(lxbxh)+(lxbxh).....) + todi2((lxbxh)+(lxbxh)+(lxbxh).....) + .....
    { name: 'labour_name', label: 'Labour Name', type: 'text' },
    { name: 'transportType', label: 'Transport Type', type: 'select', options: ['Hydra', 'Truck'] },
    { name: 'vehicle_number', label: 'Vehicle Number', type: 'text' },
    { name: 'vehicle_cost', label: 'Vehicle Cost', type: 'number' },
    { name: 'total_amount', label: 'Total Amount', type: 'number' }, // total_amount = block_amount + vehicle_cost
    { name: 'total_quantity', label: 'Total Quantity', type: 'number' },
    { name: 'issued_quantity', label: 'Issued Quantity', type: 'number' },
    { name: 'left_quantity', label: 'Left Quantity', type: 'number' },

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
        let finalTotal = 0
        let blockAmount = 0

        if (Array.isArray(data.todi)) {
          for (const todiItem of data.todi) {
            const todicost = todiItem.todicost || 0
            let todiTotal = 0

            if (Array.isArray(todiItem.addmeasures)) {
              for (const item of todiItem.addmeasures) {
                const l = item.l || 0
                const b = item.b || 0
                const h = item.h || 0

                // Calculate volume for this measurement
                const volume = l * b * h
                // Add to this Todi's total
                todiTotal += volume
              }
            }
            // Multiply Todi's total volume by its cost
            blockAmount += todiTotal * todicost
          }
        }

        // Calculate final total
        const vehicleCost = data.vehicle_cost || 0
        finalTotal = blockAmount + vehicleCost

        const partyAdvance = data.partyAdvancePayment || 0
        const partyRemaining = finalTotal - partyAdvance

        return {
          ...data,
          block_amount: blockAmount,
          final_total: finalTotal,
          total_amount: finalTotal,
          partyRemainingPayment: partyRemaining,
        }
      },
    ],
  },
}
