import { type NextRequest, NextResponse } from 'next/server';
import { getVouchers, redeemVoucher } from '@/lib/store';
import { isAuthorized } from '@/lib/auth';

// GET — list all vouchers (admin only)
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const vouchers = await getVouchers();
  return NextResponse.json({ vouchers, total: vouchers.length });
}

// POST — redeem a voucher by code (admin only)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { code } = (await request.json()) as { code?: string };
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  const result = await redeemVoucher(code);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, reason: result.reason, voucher: result.voucher },
      { status: result.reason === 'not_found' ? 404 : 409 }
    );
  }
  return NextResponse.json({ success: true, voucher: result.voucher });
}
