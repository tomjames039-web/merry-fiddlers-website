import type { NextRequest } from 'next/server';

/**
 * Simple shared-secret admin auth.
 * The admin dashboard logs in with this password and then sends it as a
 * Bearer token on every data request.
 */
export function getAdminPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_API_KEY ||
    'merryfiddlers2025'
  );
}

export function isAuthorized(request: NextRequest): boolean {
  const header = request.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  return token.length > 0 && token === getAdminPassword();
}
