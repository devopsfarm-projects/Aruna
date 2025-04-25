// collections/Parties.ts
import type { CollectionConfig } from 'payload'
export const Mines: CollectionConfig = {
  slug: 'Mines',
  admin: {
    useAsTitle: 'Mines_name',
  },
  fields: [
    { name: 'Mines_name', type: 'text', required: true },
    { name: 'address', type: 'textarea' },
    { name: 'GST', type: 'text' },
    {
      name: 'phone',
      type: 'array',
      label: 'Phone Numbers',
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Phone Number',
        }
      ]
    },
    
    { name: 'mail_id', type: 'email' },
  ],
}

export default Mines
