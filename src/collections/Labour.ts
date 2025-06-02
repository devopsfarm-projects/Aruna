// collections/Parties.ts
import type { CollectionConfig } from 'payload'
export const Labour: CollectionConfig = {
    slug: 'labour',
    admin: {
      useAsTitle: 'name',
    },
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'mobile', label: 'Mobile No.', type: 'number' },
    ],
  };
  
  export default Labour;