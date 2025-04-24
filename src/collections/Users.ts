import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: ({ req: { user } }) => user?.role === 'owner',

    delete: ({ req: { user } }) => user?.role === 'owner',

    read: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'owner' || {
        id: {
          equals: user.id,
        },
      };
    },

    update: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'owner' || {
        id: {
          equals: user.id,
        },
      };
    },
  },

  fields: [
    { name: 'name', type: 'text', defaultValue: "trilok", required: true },
    { name: 'phone', type: 'text', defaultValue: "1111111111" },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        {
          label: 'Owner',
          value: 'owner',
        },
        {
          label: 'Client',
          value: 'client',
        },
        {
          label: 'Sites Visitor',
          value: 'sites-visitor',
        },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'owner',
      },
    },
  ],
};
