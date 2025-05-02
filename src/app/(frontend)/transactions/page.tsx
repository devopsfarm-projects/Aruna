// app/transactions/page.tsx
import Transactions from './transactions'; // adjust import if filename differs
import configPromise from '@payload-config';
import { getPayload } from 'payload';

export default async function TransactionsPage() {
  const payload = await getPayload({ config: configPromise });

  const transactionsData = await payload.find({
    collection: 'transactions',
    limit: 100, // optional: change as needed
  });

  return (
    <Transactions transactionsItems={transactionsData.docs} />
  );
}
