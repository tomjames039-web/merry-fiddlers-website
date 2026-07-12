import { type NextRequest, NextResponse } from 'next/server';
import { getVouchers, redeemVoucher, unredeemVoucher } from '@/lib/store';
import { isAuthorized, getAdminPassword } from '@/lib/auth';

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

// PATCH — reverse a redemption (admin only + password re-entry for security)
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { code, action, confirmPassword } = (await request.json()) as {
    code?: string;
    action?: string;
    confirmPassword?: string;
  };
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  if (action !== 'unredeem') {
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  }
  // SECURITY: reversing a redemption lets a voucher be used again, so we require
  // the admin password to be typed again for this specific action. This blocks
  // an unattended, already-logged-in screen from being used to reverse sales.
  if (!confirmPassword || confirmPassword !== getAdminPassword()) {
    return NextResponse.json(
      { success: false, reason: 'bad_password' },
      { status: 403 }
    );
  }
  const result = await unredeemVoucher(code);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, reason: result.reason, voucher: result.voucher },
      { status: result.reason === 'not_found' ? 404 : 409 }
    );
  }
  return NextResponse.json({ success: true, voucher: result.voucher });
}
