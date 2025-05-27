import type { CollectionConfig } from 'payload'

export const Accounts: CollectionConfig = {
    slug: 'AccountsStatement',
    admin: {
      useAsTitle: 'name',
      group: 'Statements'
    },
    fields: [
      {
        name: 'category',
        type: 'select',
        options: [
          { label: 'Stone', value: 'stone' },
          { label: 'Block', value: 'block' }
        ],
        required: true,
        admin: {
          position: 'sidebar'
        }
      },
      {
        name: 'name',
        type: 'text',
        required: true
      },
      {
        name: 'stone',
        type: 'relationship',
        relationTo: 'stone',
        hasMany: true,
        required: true,
        admin: {
          condition: (data) => data?.category === 'stone',
          position: 'sidebar'
        }
      },
      {
        name: 'block',
        type: 'relationship',
        relationTo: 'Block',
        hasMany: true,
        required: true,
        admin: {
          condition: (data) => data?.category === 'block',
          position: 'sidebar'
        }
      },
      {
        name: 'date',
        type: 'date',
        required: true,
        admin: {
          position: 'sidebar'
        }
      },
      {
        name: 'mine',
        type: 'relationship',
        relationTo: 'Mines',
        hasMany: true,
        required: true,
        admin: {
          position: 'sidebar'
        }
      },
      {
        name: 'vendor',
        type: 'relationship',
        relationTo: 'vendor',
        hasMany: true,
        required: true,
        admin: {
          position: 'sidebar'
        }
      },
      {
        name: 'totalamount',
        type: 'number',
        required: true,
        admin: {
          position: 'sidebar'
        }
      },
      {
        name: 'statementDetails',
        type: 'array',
        fields: [
          {
            name: 'statementType',
            type: 'select',
            options: [
              { label: 'Stone Statement', value: 'stone' },
              { label: 'Block Statement', value: 'block' }
            ],
            required: true
          },
          {
            name: 'statementDate',
            type: 'date',
            required: true
          },
          {
            name: 'amount',
            type: 'number',
            required: true
          },
          {
            name: 'description',
            type: 'textarea'
          }
        ]
      }
    ],
    access: {
      read: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
};

export default Accounts;
  