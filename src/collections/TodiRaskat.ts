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


  hooks: {
    beforeChange: [
      async ({ data }) => {
        // 1. Default final_cost = estimate_cost if depreciation not provided
        if (!data.depreciation || data.depreciation === 0) {
          data.final_cost = data.estimate_cost;
        }
  
        // 2. Calculate partyRemainingPayment
        const estimateCost = Number(data.estimate_cost || 0);
        const received = Array.isArray(data.received_amount)
          ? data.received_amount.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
          : 0;
  
        data.partyRemainingPayment = estimateCost - received;
  
        return data;
      },
    ],
  },

  fields: [
    { name: 'BlockType', label: 'Block Type', type: 'select', required: true, options: ['Brown', 'White'], },
    { name: 'date', label: 'Date', type: 'date', defaultValue: () => new Date(), },
    { name: 'vender_id', label: 'Vendor Id', type: 'relationship', relationTo: 'vendor' },
    { name: 'munim', label: 'Munim', type: 'text' },
    { name: 'l', label: 'Length (लम्बाई)', type: 'number', required: true, min: 1, },
    { name: 'b', label: 'Breadth (चौड़ाई)', type: 'number', min: 1, },
    { name: 'h', label: 'Height (ऊंचाई)', type: 'number', min: 1, },
    { name: 'todi_cost', label: 'Todi Raskat Cost', type: 'number' },
    { name: 'hydra_cost', label: 'Hydra Cost', type: 'number' },
    { name: 'truck_cost', label: 'Truck Cost', type: 'number' },
    { name: 'total_todi_area', label: 'Total Todi Raskat Area', type: 'number' },
    { name: 'total_todi_cost', label: 'Total Todi Raskat Cost', type: 'number' },
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
      fields:[
        {name:'delivered_block_area',label:'Delivered Block Area',type:'number'},
        {name:'delivered_block_cost',label:'Delivered Block Cost',type:'number'},
        {name:'date',label:'Date',type:'date'},
        {name:'description',label:'Description',type:'textarea'},
      ]
    },

   
    {
      name: 'received_amount',
      type: 'array',
      label: 'Received Amounts',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    {
      name: 'partyRemainingPayment',
      label: 'Party Remaining Payment',
      type: 'number',
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
