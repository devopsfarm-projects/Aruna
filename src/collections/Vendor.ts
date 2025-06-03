

// collections/vendor.ts
import type { CollectionConfig } from 'payload'
export const Vendor: CollectionConfig = {
  slug: 'vendor',
  admin: {
    useAsTitle: 'vendor',
  },
  fields: [
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'vendor', label:'Vendor Name', type: 'text' },
    { name: 'vendor_no', label: 'Vendor Mobile No.', type: 'text' },
  ],
}

export default Vendor
