import { getPayload } from 'payload';
import config from '@payload-config';
import { Todi } from '@/payload-types';
import VendorAccountCard from './components/VendorAccountCard';

export default async function VendorAccountPage() {
  const payload = await getPayload({ config });
  const vendorAccounts = await payload.find({
    collection: 'vendorAccount',
    depth: 1,
  });

  return (
    <div>
      <h1 className="text-2xl py-24 font-bold mb-4 dark:text-white">Vendor Accounts</h1>
      <div className="space-y-4 dark:bg-gray-900">
        {vendorAccounts.docs.map((doc) => (
          <VendorAccountCard
            key={doc.id}
            id={doc.id}
            todi={doc.todi}
            received_amount={doc.received_amount}
            updatedAt={doc.updatedAt}
            createdAt={doc.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
