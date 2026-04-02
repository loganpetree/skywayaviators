'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Program } from '@/types/program';
import { Aircraft } from '@/types/aircraft';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle, ArrowRight, Plane, ShieldCheck, Clock, Sparkles } from 'lucide-react';

function programNameToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function FlightSchoolPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [fleetLoading, setFleetLoading] = useState(true);
  const [flightStatus, setFlightStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'programs'));
        const data: Program[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          data.push({
            id: doc.id,
            name: d.name || '',
            description: d.description || '',
            features: d.features || [],
            images: d.images || [],
            price: d.price || '',
          } as Program);
        });
        setPrograms(data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

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
        setFleetLoading(false);
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
          const data = await res.json();
          setFlightStatus(data);
        }
      } catch {
        // Silently fail — status badge just won't show
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [aircraft]);

  const openBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-dialog'));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-950 py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/commercial-card.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-widest uppercase mb-6">
              <GraduationCap className="w-4 h-4" />
              Flight School
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Start your
              <br />
              <span className="text-sky-400">pilot career</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
              From your first discovery flight through commercial certification and CFI — we&apos;ll get you there with structured programs and experienced instructors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={openBooking}
                className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-7 py-3 text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 cursor-pointer"
              >
                <Plane className="w-4 h-4 mr-2 -rotate-45" />
                Book a Discovery Flight
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-2">
              Our Programs
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Certifications we offer
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-80" />
              ))}
            </div>
          ) : programs.length === 0 ? (
            <p className="text-gray-500 text-lg">No programs available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => {
                const gradients = [
                  'from-sky-600 to-sky-700',
                  'from-indigo-600 to-indigo-700',
                  'from-violet-600 to-violet-700',
                  'from-blue-600 to-blue-700',
                  'from-cyan-600 to-cyan-700',
                  'from-teal-600 to-teal-700',
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <div
                    key={program.id || index}
                    onClick={() => router.push(`/program/${programNameToSlug(program.name)}`)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image / Gradient */}
                    <div className="relative h-48">
                      {program.images && program.images.length > 0 ? (
                        <Image
                          src={program.images[0].large || program.images[0].medium || program.images[0].original}
                          alt={program.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <h3 className="text-xl font-bold text-white">{program.name}</h3>
                        {program.price && (
                          <p className="text-sm text-white/70 mt-0.5">{program.price}</p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {program.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {program.description}
                        </p>
                      )}

                      {program.features && program.features.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {program.features.slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      )}

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 uppercase tracking-wide group-hover:gap-2.5 transition-all duration-200">
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Fleet */}
      <section id="fleet" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-2">
              Our Fleet
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Train in modern aircraft
            </h2>
          </div>

          {fleetLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-200 animate-pulse h-72" />
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

      {/* Financing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-2">
              Financing
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Affordable ways to train
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900" />
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 40%)',
            }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

            <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 md:p-12 lg:p-16">
              <div className="md:col-span-3 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2.5 mb-5">
                  <span className="text-[11px] font-medium tracking-widest uppercase text-indigo-300/70">Powered by</span>
                  <Image
                    src="/wurthy-logo.svg"
                    alt="Wurthy"
                    width={80}
                    height={18}
                    className="h-[18px] w-auto opacity-70"
                  />
                </span>

                <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white tracking-tight leading-tight mb-5">
                  Focus on Flying,
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Not Finances
                  </span>
                </h3>

                <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mb-8">
                  Flexible financing lets you start training today with affordable monthly payments.
                  No upfront burden — just a clear path from student pilot to the flight deck.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-7 py-3 text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 transition-all duration-200 cursor-pointer">
                    Apply for Financing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 gap-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'No Credit Check',
                    desc: 'Get approved based on your earning potential, not your credit score.',
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10 border-emerald-500/20',
                  },
                  {
                    icon: Clock,
                    title: 'Quick Approval',
                    desc: 'Apply in minutes and get a decision the same day.',
                    color: 'text-sky-400',
                    bg: 'bg-sky-500/10 border-sky-500/20',
                  },
                  {
                    icon: Sparkles,
                    title: 'Flexible Terms',
                    desc: 'Monthly payments designed to fit a student pilot budget.',
                    color: 'text-purple-400',
                    bg: 'bg-purple-500/10 border-purple-500/20',
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className={`flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm ${feat.bg}`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 ${feat.color}`}>
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {feat.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-400">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Book a discovery flight and see if flying is right for you. No experience required.
          </p>
          <Button
            onClick={openBooking}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 py-3 text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 cursor-pointer"
          >
            <Plane className="w-4 h-4 mr-2 -rotate-45" />
            Book a Discovery Flight
          </Button>
        </div>
      </section>
    </div>
  );
}
