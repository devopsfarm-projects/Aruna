import type { CollectionConfig } from 'payload';

export const VendorAccount: CollectionConfig = {
  slug: 'vendorAccount',
  admin: {
    useAsTitle: 'todi',
  },
  fields: [
    {
      name: 'todi',
      type: 'relationship',
      relationTo: 'Todi',
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
  ],
};

export default VendorAccount;
