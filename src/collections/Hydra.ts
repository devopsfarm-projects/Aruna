// collections/Parties.ts
import type { CollectionConfig } from 'payload'
export const Truck: CollectionConfig = {
  slug: 'truck',
  admin: {
    useAsTitle: 'driver_name',
  },
  fields: [
    { name: 'driver_name', label: 'Driver Name', type: 'text', required: true },
    { name: 'phone', label: 'Driver Mobile No.', type: 'text' },
    { name: 'truck_no', label: 'Truck No', type: 'text' },
    { name: 'truck_cost', label: 'Truck Cost', type: 'text' },
  ],
}

export default Truck
