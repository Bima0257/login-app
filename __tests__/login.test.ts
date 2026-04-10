import { POST } from '../app/api/login/route';
import { db } from '../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkRateLimit } from '../lib/rateLimiter';

// mock semua dependency
jest.mock('../lib/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../lib/rateLimiter');
jest.mock('next/headers', () => ({
  headers: async () => new Map([['x-forwarded-for', '127.0.0.1']]),
}));

describe('Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('❌ email tidak ditemukan', async () => {
    (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
    (db.query as jest.Mock).mockResolvedValue([[]]);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@mail.com',
        password: '123456',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toBe('Email atau password salah');
  });

  test('❌ password salah', async () => {
    (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
    (db.query as jest.Mock).mockResolvedValue([
      [{ id: 1, email: 'test@mail.com', password: 'hashed' }],
    ]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@mail.com',
        password: 'wrong',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toBe('Email atau password salah');
  });

  test('✅ login berhasil', async () => {
    (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
    (db.query as jest.Mock).mockResolvedValue([
      [{ id: 1, email: 'test@mail.com', password: 'hashed' }],
    ]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake-token');

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@mail.com',
        password: '123456',
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('Set-Cookie')).toContain('token=fake-token');
  });

  test('🚫 rate limit kena', async () => {
    (checkRateLimit as jest.Mock).mockReturnValue({
      allowed: false,
      remainingTime: 60,
    });

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@mail.com',
        password: '123456',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.message).toBe('Terlalu banyak percobaan login');
  });
});
