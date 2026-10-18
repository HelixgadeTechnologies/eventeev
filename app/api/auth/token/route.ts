import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('x-auth-token')?.value || '';
  return NextResponse.json({ token });
}
