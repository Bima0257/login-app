import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 🔑 helper untuk verify JWT
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isPublicPage = pathname === '/'; 

  let user = null;

  // 🔐 cek token kalau ada
  if (token) {
    user = await verifyToken(token);
  }

  // ❌ BELUM LOGIN → blok dashboard
  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ✅ SUDAH LOGIN → cegah akses ke halaman public ("/")
  if (user && isPublicPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ❌ token ada tapi invalid → hapus cookie + redirect
  if (token && !user) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('token'); // cleanup
    return response;
  }

  return NextResponse.next();
}

// 🎯 route yang dikontrol middleware
export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
