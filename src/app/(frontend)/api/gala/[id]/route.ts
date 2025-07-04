// app/api/gala/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET handler to fetch a single Gala
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  const id = (await params).id

  try {
    const result = await payload.findByID({
      collection: 'Gala',
      id: id,
    })

    if (!result) {
      return NextResponse.json({ error: 'Gala not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching Gala:', error)
    return NextResponse.json({ error: 'Failed to fetch Gala' }, { status: 500 })
  }
}

// POST handler to create a new Gala
export async function POST(request: NextRequest) {
  const payload = await getPayload({ config })
  const body = await request.json()

  try {
    const result = await payload.create({
      collection: 'Gala',
      data: body,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating Gala:', error)
    return NextResponse.json({ error: 'Failed to create Gala' }, { status: 500 })
  }
}

// DELETE handler to delete a Gala
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
    console.error('Error deleting Gala:', error)
    return NextResponse.json({ error: 'Failed to delete Gala' }, { status: 500 })
  }
}
