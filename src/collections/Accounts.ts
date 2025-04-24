// collections/Accounts.ts
import type { CollectionConfig } from 'payload'
export const Accounts: CollectionConfig = {
    slug: 'accounts',
    admin: {
      useAsTitle: 'name',
    },
    fields: [
      { name: 'name', type: 'text', required: true },
      {
        name: 'type',
        type: 'select',
        options: ['clinet',  'vendor'],
      },
      {
        name: 'site',
        type: 'relationship',
        relationTo: 'sites',
        required: false,
      },
      {
        name: 'party',
        type: 'relationship',
        relationTo: 'parties',
        required: false,
      },
      { name: 'opening_balance', type: 'number' },
      { name: 'current_balance', type: 'number' },
      { name: 'is_locked', type: 'checkbox', defaultValue: false },
    ],
  };
  
  export default Accounts;
  