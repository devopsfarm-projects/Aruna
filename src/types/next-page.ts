import { NextRequest } from 'next/server'

export type PageProps = {
  searchParams: Promise<NextRequest['nextUrl']['searchParams']>
}
