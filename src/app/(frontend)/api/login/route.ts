import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

const JWT_SECRET = 'aruna'; 

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const { docs: users } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    });

    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Ensure user.password is a string before calling bcrypt.compare
    if (!user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password); // Use await here

    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
