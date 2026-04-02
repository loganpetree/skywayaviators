import { NextResponse } from 'next/server';

const cache = new Map<string, { flying: boolean; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000;

// FR24 feed array indices
const IDX_ALT = 4;     // altitude in feet
const IDX_SPEED = 5;   // ground speed in knots
const IDX_TS = 10;     // last-seen unix timestamp
const IDX_ON_GND = 14; // 0 = airborne, 1 = on ground

async function isAirborne(tailNumber: string): Promise<boolean> {
  const cached = cache.get(tailNumber);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.flying;
  }

  try {
    const url =
      `https://data-live.flightradar24.com/zones/fcgi/feed.js` +
      `?reg=${encodeURIComponent(tailNumber)}` +
      `&faa=1&satellite=1&mlat=1&flarm=1&adsb=1` +
      `&gnd=0&air=1&vehicles=0&estimated=0&maxage=300&gliders=0&stats=0`;

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Origin': 'https://www.flightradar24.com',
        'Referer': 'https://www.flightradar24.com/',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      cache.set(tailNumber, { flying: false, timestamp: Date.now() });
      return false;
    }

    const data = await res.json();
    const metaKeys = new Set(['full_count', 'version', 'stats']);
    const nowSec = Math.floor(Date.now() / 1000);

    const flying = Object.keys(data)
      .filter((k) => !metaKeys.has(k))
      .some((k) => {
        const entry = data[k];
        if (!Array.isArray(entry)) return false;

        const altitude = Number(entry[IDX_ALT]) || 0;
        const speed = Number(entry[IDX_SPEED]) || 0;
        const onGround = Number(entry[IDX_ON_GND]);
        const lastSeen = Number(entry[IDX_TS]) || 0;
        const staleSec = nowSec - lastSeen;

        return onGround === 0 && altitude > 100 && speed > 30 && staleSec < 300;
      });

    cache.set(tailNumber, { flying, timestamp: Date.now() });
    return flying;
  } catch {
    cache.set(tailNumber, { flying: false, timestamp: Date.now() });
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { tailNumbers } = await request.json();

    if (!Array.isArray(tailNumbers) || tailNumbers.length === 0) {
      return NextResponse.json({ error: 'tailNumbers must be a non-empty array' }, { status: 400 });
    }

    const capped = tailNumbers.slice(0, 20);
    const results: Record<string, boolean> = {};

    await Promise.all(
      capped.map(async (tn: string) => {
        results[tn] = await isAirborne(tn);
      })
    );

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=120' },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
