// collections/Parties.ts
import type { CollectionConfig } from 'payload'
export const Parties: CollectionConfig = {
    slug: 'parties',
    admin: {
      useAsTitle: 'name',
    },
    fields: [
      { name: 'name', type: 'text', required: true },
      {
        name: 'category',
        type: 'select',
        options: ['block_supplier', 'labour_contractor', 'other'],
      },
      { name: 'contact_person', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'pan_number', type: 'text' },
      { name: 'gst', type: 'text' },
      { name: 'address', type: 'textarea' },
    ],
  };
  
  export default Parties;
  