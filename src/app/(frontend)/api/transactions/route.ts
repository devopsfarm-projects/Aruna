import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest } from 'next/server'

export const GET = async () => {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({ collection: 'transactions' });

  return Response.json(data);
};

export const POST = async (req: NextRequest) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const formData = await req.formData()

    const accountIdRaw = formData.get('account')
    const accountId = accountIdRaw ? Number(accountIdRaw.toString()) : undefined

    if (accountId !== undefined && isNaN(accountId)) {
      return new Response(JSON.stringify({ error: 'Invalid account ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const enteredByIdRaw = formData.get('entered_by')
    const enteredById = enteredByIdRaw ? Number(enteredByIdRaw.toString()) : undefined

    const modeRaw = formData.get('mode')?.toString()
    const allowedModes = ['cash', 'upi', 'bank', 'cheque'] as const
    const mode = allowedModes.includes(modeRaw as any) ? (modeRaw as typeof allowedModes[number]) : undefined

    const document = formData.get('document') as File | null;
    let payloadFile: {
      name: string;
      data: Buffer;
      mimetype: string;
      size: number;
    } | undefined;

    if (document) {
      const arrayBuffer = await document.arrayBuffer();
      payloadFile = {
        name: document.name,
        data: Buffer.from(arrayBuffer),
        mimetype: document.type,
        size: document.size,
      };
    }

    const createdTransaction = await payload.create({
      collection: 'transactions',
      data: {
        account: accountId && !isNaN(accountId) ? accountId : undefined,
        type: formData.get('type') as 'credit' | 'debit',
        amount: Number(formData.get('amount')),
        mode,
        description: formData.get('description')?.toString() || '',
        txn_date: formData.get('txn_date')?.toString() || '',
        entered_by: enteredById && !isNaN(enteredById) ? enteredById : undefined,
      },
      file: payloadFile,
    })

    return Response.json(createdTransaction)
  } catch (err: any) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to create transaction' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
