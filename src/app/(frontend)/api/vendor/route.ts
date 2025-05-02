

import configPromise from '@payload-config';
import { getPayload } from 'payload';

export const GET = async () => {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({ collection: 'vendor' });

  return Response.json(data);
};

export const POST = async (req: Request) => {
  const payload = await getPayload({ config: configPromise });
  const body = await req.json();

  try {
    const vendor = await payload.create({
      collection: 'vendor',
      data: {
        Mines_name: body.Mines_name, 
        address: body.address,
        vendor: body.vendor,
        GST: body.GST,
        vendor_no: body.vendor_no,
        Company_no: body.Company_no,
        mail_id: body.mail_id,
      },
    });

    return Response.json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
