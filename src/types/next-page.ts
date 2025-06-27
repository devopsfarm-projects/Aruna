import { NextRequest } from 'next/server'

export type PageProps = {
  searchParams: NextRequest['nextUrl']['searchParams']
}
