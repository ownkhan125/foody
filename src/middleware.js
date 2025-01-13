// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Token ko get karne ke liye

export async function middleware(req) {
  // Token ko check karo (session ko verify karna)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Agar token exist karta hai, toh dashboard par redirect kar do
  if (token) {
    return NextResponse.redirect(new URL('/dashboard', req.url)); // Redirect to dashboard
  }

  // if (!token) {
  //   return NextResponse.redirect(new URL('/', req.url)); // Redirect to dashboard
  // }

  // Agar token nahi hai, toh next request ko allow kar do (ya home page par redirect karo)
  return NextResponse.next();
}

// Yeh config specify karega ki yeh middleware kis path par apply hoga
export const config = {
  matcher: ['/'], // Yeh middleware home page (/) par apply hoga
};
