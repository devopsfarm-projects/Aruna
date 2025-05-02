

// collections/vendor.ts
import type { CollectionConfig } from 'payload'
export const Vendor: CollectionConfig = {
  slug: 'vendor',
  admin: {
    useAsTitle: 'vendor',
  },
  fields: [
    { name: 'Mines_name', label:'Mines Name', type: 'relationship', relationTo: 'Mines' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'vendor', label:'Vendor Name', type: 'text' },
    { name: 'GST', label:'GST No.', type: 'text' },
    { name: 'vendor_no', label: 'Vendor Mobile No.', type: 'text' },
    { name: 'Company_no', label: 'Company Mobile No.', type: 'text' },
    { name: 'mail_id', label:'Mail id', type: 'email' },
  ],
}

export default Vendor
