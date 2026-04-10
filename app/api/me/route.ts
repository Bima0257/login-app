import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const [rows]: any = await db.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [decoded.id],
    );

    if (rows.length === 0) {
      return Response.json(
        { message: 'User tidak ditemukan' },
        { status: 404 },
      );
    }

    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
}
