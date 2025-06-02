// collections/Sites.ts
import type { CollectionConfig } from 'payload'
export const Sites: CollectionConfig = {
    slug: 'sites',
    admin: {
      useAsTitle: 'site_name',
    },
    fields: [
      { name: 'site_name', type: 'text', required: true },
      { name: 'location', type: 'textarea' },
      { name: 'is_closed', type: 'checkbox', defaultValue: false },
      { name: 'start_date', type: 'date' },
      { name: 'end_date', type: 'date' },
    ],
  };
  
  export default Sites;
  