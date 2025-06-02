// collections/Transactions.ts
import type { CollectionConfig } from 'payload'
export const Transactions: CollectionConfig = {
    slug: 'transactions',
    admin: {
      useAsTitle: 'description',
    },
    fields: [
      {
        name: 'account',
        type: 'relationship',
        relationTo: 'accounts',
        // required: true,
      },
      {
        name: 'type',
        type: 'select',
        options: ['credit', 'debit'],
      },
      { name: 'amount', type: 'number' },
      {
        name: 'mode',
        type: 'select',
        options: ['cash', 'upi', 'bank', 'cheque'],
      },
      { name: 'description', type: 'textarea' },
      { name: 'txn_date', type: 'date' },
      {
        name: 'document',
        type: 'upload',
        relationTo: 'media',
        // required: false,
      },
      {
        name: 'entered_by',
        type: 'relationship',
        relationTo: 'users',
      },
    ],
  };
  
  export default Transactions;
  