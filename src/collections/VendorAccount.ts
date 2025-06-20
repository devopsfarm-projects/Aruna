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
  ],
};

export default VendorAccount;
