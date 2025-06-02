// collections/Reminders.ts
import type { CollectionConfig } from 'payload'
export const Reminders:CollectionConfig = {
    slug: 'reminders',
    fields: [
      {
        name: 'user',
        type: 'relationship',
        relationTo: 'users',
      },
      { name: 'message', type: 'textarea' },
      { name: 'due_date', type: 'date' },
    ],
  };
  
  export default Reminders;
  