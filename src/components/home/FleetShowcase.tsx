'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Aircraft } from '@/types/aircraft';
import { ArrowRight } from 'lucide-react';

export default function FleetShowcase() {
  const router = useRouter();
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [flightStatus, setFlightStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'aircraft'));
        const data: Aircraft[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          if (!d.isHidden) {
            data.push({ id: doc.id, ...d } as Aircraft);
          }
        });
        setAircraft(data);
      } catch (err) {
        console.error('Error fetching aircraft:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAircraft();
  }, []);

  useEffect(() => {
    if (aircraft.length === 0) return;

    const tailNumbers = aircraft.map((a) => a.tailNumber);

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/flight-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tailNumbers }),
        });
        if (res.ok) {
          setFlightStatus(await res.json());
        }
      } catch {
        // Silently fail
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [aircraft]);

  return (
    <section id="fleet" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-2">
              Our Fleet
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Train in modern aircraft
            </h2>
          </div>
          <button
            onClick={() => router.push('/flightschool#fleet')}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors cursor-pointer"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse h-56" />
            ))}
          </div>
        ) : aircraft.length === 0 ? (
          <p className="text-gray-500 text-lg">No aircraft available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aircraft.map((plane) => (
              <div
                key={plane.id}
                onClick={() => router.push(`/aircraft/${plane.tailNumber}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-56">
                  {plane.images && plane.images.length > 0 ? (
                    <Image
                      src={plane.images[0].large || plane.images[0].medium || plane.images[0].original}
                      alt={`${plane.type} ${plane.model} ${plane.tailNumber}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
                  {flightStatus[plane.tailNumber] && (
                    <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-semibold text-emerald-400 border border-emerald-400/30">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      En Route
                    </span>
                  )}
                  {plane.equipment && plane.equipment.includes('IFR') && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-xs font-semibold text-white">
                      IFR Equipped
                    </span>
                  )}
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {plane.type} {plane.model}
                      </h3>
                      <p className="text-sm text-white/70">{plane.tailNumber}</p>
                    </div>
                    <span className="text-sm font-semibold text-white bg-white/15 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                      ${plane.hourlyRate}/hr
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
