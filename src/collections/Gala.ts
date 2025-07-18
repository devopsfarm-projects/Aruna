import type { CollectionConfig } from 'payload'

export const Gala: CollectionConfig = {
  slug: 'Gala',
  admin: {
    useAsTitle: 'GalaType',
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
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Default final_cost = estimate_cost if depreciation not provided
        if (!data.depreciation || data.depreciation === 0) {
          data.final_cost = data.estimate_cost;
        }
  
        // Calculate partyRemainingPayment
        const finalCost = Number(data.final_cost || 0);
        const received = Array.isArray(data.received_amount)
          ? data.received_amount.reduce((sum, amt) => sum + (amt.amount || 0), 0)
          : 0;
  
        data.partyRemainingPayment = finalCost - received;
  
        // ===== Calculate total_block_area and total_block_cost =====
        let totalBlockArea = 0;
        let totalBlockCost = 0;
  
        if (Array.isArray(data.group)) {
          for (const groupItem of data.group) {
            if (Array.isArray(groupItem.block)) {
              for (const block of groupItem.block) {
                if (Array.isArray(block.addmeasures)) {
                  for (const measure of block.addmeasures) {
                    totalBlockArea += Number(measure.block_area || 0);
                    totalBlockCost += Number(measure.block_cost || 0);
                  }
                }
              }
            }
          }
        }
  
        data.total_block_area = totalBlockArea;
        data.total_block_cost = totalBlockCost;
  
        return data;
      },
    ],
  },
  
  fields: [
    { name: 'GalaType', label: 'Gala Type', type: 'select', required: true, options: ['Brown', 'White'], },
    { name: 'date', label: 'Date', type: 'date', defaultValue: () => new Date(), },
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'vendor' },
    { name: 'munim', label: 'Munim', type: 'text' },
    { name: 'l', label: 'Length (लम्बाई)', type: 'number', required: true, min: 1, },
    { name: 'front_b', label: 'Front Breadth (चौड़ाई)', type: 'number', min: 1, },
    { name: 'back_b', label: 'Back Breadth (चौड़ाई)', type: 'number', min: 1, },
    { name: 'total_b', label: 'Total Breadth (चौड़ाई)', type: 'number', min: 1, },
    { name: 'h', label: 'Height (ऊंचाई)', type: 'number', min: 1, },
    { name: 'gala_cost', label: 'Gala Cost', type: 'number' },
    { name: 'hydra_cost', label: 'Hydra Cost', type: 'number' },
    { name: 'truck_cost', label: 'Truck Cost', type: 'number' },
    { name: 'total_gala_area', label: 'Total Gala Area', type: 'number' },
    { name: 'total_gala_cost', label: 'Total Gala Cost', type: 'number' },
    { name: 'estimate_cost', label: 'Estimate Cost', type: 'number' },
    { name: 'depreciation', label: 'Depreciation', type: 'number' },
    { name: 'final_cost', label: 'Final Cost', type: 'number' },
    { name: 'group', label: 'Group Details', type: 'array', fields: [
      { name: 'date', label: 'Date', type: 'date', defaultValue: () => new Date(), },
      { name: 'g_hydra_cost', label: 'Hydra Cost', type: 'number' },
      { name: 'g_truck_cost', label: 'Truck Cost', type: 'number' },
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

    {name:'total_block_area',label:'Total Block Area',type:'number'},
    {name:'total_block_cost',label:'Total Block Cost',type:'number'},

    {name:'delivered_block',label:'Delivered Block',type:'array',
      access: {
        create: ({ req }) => req?.user?.role === 'admin',
        read: ({ req }) => req?.user?.role === 'admin',
        update: ({ req }) => req?.user?.role === 'admin',
      },
      fields:[
        {name:'delivered_block_area',label:'Delivered Block Area',type:'number'},
        {name:'delivered_block_cost',label:'Delivered Block Cost',type:'number'},
        {name:'date',label:'Date',type:'date'},
        {name:'description',label:'Description',type:'textarea'},
      ]
    },

   
    {name: 'received_amount',type: 'array',label: 'Received Amounts',
      access: {
        create: ({ req }) => req?.user?.role === 'admin',
        read: ({ req }) => req?.user?.role === 'admin',
        update: ({ req }) => req?.user?.role === 'admin',
      },
      fields: [
        {name: 'amount',type: 'number',required: true,},
        {name: 'date',type: 'date',required: true,},
        {name: 'description',type: 'textarea',},
      ]},

    {name: 'partyRemainingPayment',label: 'Party Remaining Payment',type: 'number',
      access: {
        create: ({ req }) => req?.user?.role === 'admin',
        read: ({ req }) => req?.user?.role === 'admin',
        update: ({ req }) => req?.user?.role === 'admin',
      },
    },


    { name: 'createdBy', label: 'Created By (Client)', type: 'relationship', relationTo: 'users',
      access: {
        create: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        condition: ({ user }) => user?.role === 'admin' || user?.role === 'sites-visitor',
      },
    },
  ],
}
