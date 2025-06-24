// src/app/api/vendor-account/route.ts
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config });
    const { id } = new URL(request.url).pathname.split('/').slice(-1)[0];
    const { amount, description } = await request.json();

    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
      });
    }

    // Get existing vendor account
    const existingAccount = await payload.find({
      collection: 'vendorAccount',
      where: {
        id: {
          equals: Number(id),
        },
      },
      depth: 1,
    });

    if (!existingAccount.docs.length) {
      return new Response(JSON.stringify({ error: 'Vendor account not found' }), {
        status: 404,
      });
    }

    // Get existing received amounts
    const existingReceivedAmounts = existingAccount.docs[0].received_amount || [];

    // Add new received amount
    const newReceivedAmount = {
      amount,
      date: new Date().toISOString(),
      description,
    };

    // Update vendor account with new received amount
    await payload.update({
      collection: 'vendorAccount',
      id: Number(id),
      data: {
        received_amount: [...existingReceivedAmounts, newReceivedAmount],
      },
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error updating received amount:', error);
    return new Response(JSON.stringify({ error: 'Failed to add received amount' }), {
      status: 500,
    });
  }
}