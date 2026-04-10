import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkRateLimit } from '@/lib/rateLimiter';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  const result = checkRateLimit(ip);

  if (!result.allowed) {
    return Response.json(
      {
        message: 'Terlalu banyak percobaan login',
        retryAfter: result.remainingTime,
      },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    // ✅ VALIDASI INPUT
    if (!email || !password) {
      return Response.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 },
      );
    }

    // ✅ QUERY USER
    const [rows]: any = await db.query(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email],
    );

    // ❗ SECURITY: jangan kasih tau user tidak ditemukan / password salah
    if (rows.length === 0) {
      return Response.json(
        { message: 'Email atau password salah' },
        { status: 401 },
      );
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { message: 'Email atau password salah' },
        { status: 401 },
      );
    }

    // ❗ pastikan secret ada
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET tidak ditemukan');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return new Response(JSON.stringify({ message: 'Login berhasil' }), {
      status: 200,
      headers: {
        'Set-Cookie': [
          `token=${token}`,
          'HttpOnly',
          'Path=/',
          'Max-Age=3600',
          'SameSite=Strict',
          process.env.NODE_ENV === 'production' ? 'Secure' : '',
        ]
          .filter(Boolean)
          .join('; '),
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return Response.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 },
    );
  }
}
