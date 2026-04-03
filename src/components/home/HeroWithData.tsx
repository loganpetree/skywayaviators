'use client';

import { useEffect } from 'react';
import { useAircraftStore } from '@/stores/aircraftStore';
import HeroSection from './HeroSection';

export default function HeroWithData() {
  const { aircraft, fetched, fetchAircraft } = useAircraftStore();

  useEffect(() => {
    if (!fetched) fetchAircraft();
  }, [fetched, fetchAircraft]);

  return <HeroSection fleetSize={aircraft.length || undefined} />;
}
