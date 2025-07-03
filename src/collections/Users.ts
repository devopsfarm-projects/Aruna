import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',

    delete: ({ req: { user } }) => user?.role === 'admin',

    read: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin' || {
        id: {
          equals: user.id,
        },
      };
    },

    update: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin' || {
        id: {
          equals: user.id,
        },
      };
    },
  },

  fields: [
    { name: 'name', type: 'text', defaultValue: "", required: true },
    { name: 'phone', type: 'text', defaultValue: "" },
    {
      saveToJWT: true,
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'manager',
          value: 'manager',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
};
