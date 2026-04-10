export async function POST() {
  return new Response(JSON.stringify({ message: 'Logout berhasil' }), {
    headers: {
      'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0',
    },
  });
}
