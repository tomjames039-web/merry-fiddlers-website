import { NextResponse } from 'next/server';

// England men's football team on TheSportsDB (free public API, key "3").
const ENGLAND_TEAM_ID = '133914';
const ENDPOINT = `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${ENGLAND_TEAM_ID}`;

// Cache for 30 minutes so we never hammer the free API.
export const revalidate = 1800;

interface SportsDbEvent {
  strEvent?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  dateEvent?: string;
  strTime?: string;
  strLeague?: string;
  strVenue?: string;
}

export async function GET() {
  try {
    const res = await fetch(ENDPOINT, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'MerryFiddlers/1.0' },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, reason: 'upstream' });
    }
    const data = (await res.json()) as { events?: SportsDbEvent[] | null };
    const ev = data.events?.[0];
    if (!ev) {
      return NextResponse.json({ ok: false, reason: 'no_fixture' });
    }

    const home = ev.strHomeTeam || '';
    const away = ev.strAwayTeam || '';
    const isHome = /england/i.test(home);
    const opponent = (isHome ? away : home) || 'TBC';
    const hasTime = Boolean(ev.strTime && ev.strTime !== '00:00:00');
    const kickoffISO = ev.dateEvent
      ? `${ev.dateEvent}T${hasTime ? ev.strTime : '00:00:00'}Z`
      : null;

    return NextResponse.json({
      ok: true,
      fixture: {
        matchup: ev.strEvent || `${home} vs ${away}`.trim(),
        opponent,
        isHome,
        competition: ev.strLeague || 'Football',
        dateEvent: ev.dateEvent || null,
        kickoffISO,
        hasTime,
        venue: ev.strVenue || null,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, reason: 'error' });
  }
}
