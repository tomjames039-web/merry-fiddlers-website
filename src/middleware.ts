import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Until kick-off (Wed 15 July 2026, 8:00pm BST = 19:00 UTC) send every visitor
// who lands on the homepage straight to the England v Argentina ticket page.
// After this moment the redirect switches itself off and the homepage is normal.
const REDIRECT_UNTIL = Date.parse('2026-07-15T19:00:00.000Z');
const TICKET_PATH = '/events/england-v-argentina';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/' && Date.now() < REDIRECT_UNTIL) {
    const url = request.nextUrl.clone();
    url.pathname = TICKET_PATH;
    // 307 = temporary, so it is never cached beyond the promo window.
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}

// Only ever run on the homepage — every other page/route is untouched.
export const config = {
  matcher: '/',
};
