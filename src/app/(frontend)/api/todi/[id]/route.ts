// app/api/todi/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getPayload({ config })
    const id = (await params).id

  try {
    const result = await payload.delete({
      collection: 'Todi',
      id: id,
    })

    if (!result) {
      return NextResponse.json({ error: 'Todi not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting Todi:', error)
    return NextResponse.json({ error: 'Failed to delete Todi' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
    const payload = await getPayload({ config })
    const body = await request.json()

    try {
      const result = await payload.create({
        collection: 'Todi',
        data: body,
      })

      return NextResponse.json(result, { status: 201 })
    } catch (error) {
      console.error('Error creating Todi:', error)
      return NextResponse.json({ error: 'Failed to create Todi' }, { status: 500 })
    }
  }

  export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getPayload({ config })
    const id = (await params).id
    const body = await request.json()

    try {
      const result = await payload.update({
        collection: 'Todi',
        id: id,
        data: body,
      })

      return NextResponse.json(result)
    } catch (error) {
      console.error('Error updating Todi:', error)
      return NextResponse.json({ error: 'Failed to update Todi' }, { status: 500 })
    }
  }


  export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await getPayload({ config })
    const id = (await params).id

    try {
      const result = await payload.findByID({
        collection: 'Todi',
        id: id,
      })

      if (!result) {
        return NextResponse.json({ error: 'Todi not found' }, { status: 404 })
      }

      return NextResponse.json(result)
    } catch (error) {
      console.error('Error fetching Todi:', error)
      return NextResponse.json({ error: 'Failed to fetch Todi' }, { status: 500 })
    }
  }



  export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const payload = await getPayload({ config })
    try {
      const id = (await params).id
      const body = await request.json()
  
      console.log('Received PATCH request for Gala ID:', id)
      console.log('Request body:', body)
  
      const updated = await payload.update({
        collection: 'Todi',
        id,
        data: body,
      })
  
      console.log('Updated Todi:', updated)
      
      return NextResponse.json(updated)
    } catch (error: unknown) {
      console.error('Error updating Todi:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred'
      
      // Check if this is a Payload CMS error with status
      const status = error instanceof Error && 'status' in error 
        ? (error as any).status 
        : 400
      
      return NextResponse.json(
        { error: 'Failed to update Todi', message: errorMessage },
        { status }
      )
    }
  }
  