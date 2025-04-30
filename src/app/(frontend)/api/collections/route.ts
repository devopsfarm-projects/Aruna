import payload from 'payload';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if payload is already initialized
    if (!payload.db.connect) {
      await payload.init({
        config: require('../../../../../payload.config.ts').default, // Adjust path as needed
      });
    }

    const collections = Object.keys(payload.collections || {});
    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Error getting collections:', error);
    return NextResponse.json({ error: 'Failed to load collections' }, { status: 500 });
  }
}
