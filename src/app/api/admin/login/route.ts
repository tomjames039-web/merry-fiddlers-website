import { type NextRequest, NextResponse } from 'next/server';
import { getAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  // The password doubles as the bearer token for subsequent data requests.
  return NextResponse.json({ ok: true, token: password });
}
