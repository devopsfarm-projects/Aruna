// app/api/todi/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  const id = (await params).id

  try {
    const result = await payload.delete({
      collection: 'TodiRaskat',
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
        collection: 'TodiRaskat',
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
            collection: 'TodiRaskat',
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
                  collection: 'TodiRaskat',
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