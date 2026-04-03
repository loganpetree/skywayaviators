'use client';

import { useEffect } from 'react';
import { incrementPageLoadCount, trackPageView } from '@/lib/firebase';

export default function HomeClientEffects() {
  useEffect(() => {
    trackPageView('/', { pageType: 'home', source: 'direct' });
    incrementPageLoadCount();
  }, []);

  return null;
}
