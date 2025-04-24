// collections/Reports.ts
import type { CollectionConfig } from 'payload'
export const Reports:CollectionConfig = {
    slug: 'reports',
    fields: [
      {
        name: 'generated_by',
        type: 'relationship',
        relationTo: 'users',
      },
      { name: 'type', type: 'text' },
      { name: 'filters', type: 'textarea' },
      { name: 'created_at', type: 'date', admin: { readOnly: true } },
    ],
  };
  
  export default Reports;
  