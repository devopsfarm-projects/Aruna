import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: ({ req: { user } }) => {
      return user?.role === 'owner' || user?.role === 'client';
    },
    update: ({ req: { user } }) => {
      return user?.role === 'owner';
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'owner';
    },
  },  
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
