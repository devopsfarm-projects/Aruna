// import type { CollectionConfig } from 'payload';

// export const Transactions: CollectionConfig = {
//   slug: 'transactions',
//   admin: {
//     useAsTitle: 'reference_number',
//   },
//   access: {
//     create: ({ req: { user } }) => !!user,
//     read: ({ req: { user } }) => !!user,
//     update: ({ req: { user } }) => user?.role === 'owner',
//     delete: ({ req: { user } }) => user?.role === 'owner',
//   },
//   fields: [
//     {
//       name: 'reference_number',
//       label: 'Reference No.',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'product',
//       label: 'Related Product',
//       type: 'relationship',
//       relationTo: 'product',
//       required: true,
//     },
//     {
//       name: 'amountPaid',
//       label: 'Paid Amount',
//       type: 'number',
//       required: true,
//     },
//     {
//       name: 'paymentDate',
//       label: 'Payment Date',
//       type: 'date',
//       required: true,
//     },
//     // {
//     //     name: 'paymentMethod',
//     //     label: 'Payment Method',
//     //     type: 'select',
//     //     options: ['Cash', 'Bank Transfer', 'Cheque', 'UPI'],
//     //     required: true,
//     //   }
      
//   ],
//   hooks: {
//     afterChange: [
//       async ({ doc, req }) => {
//         const { payload } = req;
//         const productId = doc.product;

//         // Fetch all transactions for this product
//         const allTransactions = await payload.find({
//           collection: 'transactions',
//           where: {
//             product: {
//               equals: productId,
//             },
//           },
//         });

//         const totalPaid = allTransactions.docs.reduce(
//           (sum, txn) => sum + (txn.amountPaid || 0),
//           0
//         );

//         // Fetch the related product
//         const product = await payload.findByID({
//           collection: 'product',
//           id: productId,
//         });

//         const finalTotal = typeof product.final_total === 'number'
//           ? product.final_total
//           : parseFloat(product.final_total || '0');

//         const advance = typeof product.partyAdvancePayment === 'number'
//           ? product.partyAdvancePayment
//           : parseFloat(product.partyAdvancePayment || '0');

//         const partyRemaining = finalTotal - advance - totalPaid;

//         // Update the product with the new remaining payment
//         await payload.update({
//           collection: 'product',
//           id: productId,
//           data: {
//             partyRemainingPayment: partyRemaining,
//           },
//         });
//       },
//     ],
//   },
// };





// collections/Transactions.ts
import type { CollectionConfig } from 'payload'
export const Transactions: CollectionConfig = {
    slug: 'transactions',
    admin: {
      useAsTitle: 'description',
    },
    fields: [
      {
        name: 'account',
        type: 'relationship',
        relationTo: 'accounts',
        required: true,
      },
      {
        name: 'type',
        type: 'select',
        options: ['credit', 'debit'],
      },
      { name: 'amount', type: 'number' },
      {
        name: 'mode',
        type: 'select',
        options: ['cash', 'upi', 'bank', 'cheque'],
      },
      { name: 'description', type: 'textarea' },
      { name: 'txn_date', type: 'date' },
      {
        name: 'document',
        type: 'upload',
        relationTo: 'media',
        required: false,
      },
      {
        name: 'entered_by',
        type: 'relationship',
        relationTo: 'users',
      },
    ],
  };
  
  export default Transactions;
  