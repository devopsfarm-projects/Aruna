// app/api/todi/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  const id = (await params).id

  try {
    const result = await payload.delete({
      collection: 'Gala',
      id: id,
    })

    if (!result) {
      return NextResponse.json({ error: 'Gala not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting Todi:', error)
    return NextResponse.json({ error: 'Failed to delete Todi' }, { status: 500 })
  }
}
