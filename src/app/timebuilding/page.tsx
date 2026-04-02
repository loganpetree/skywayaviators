'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package } from '@/types/package';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, ArrowRight, Plane } from 'lucide-react';

function programNameToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function TimeBuildingPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'packages'));
        const data: Package[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          data.push({
            id: doc.id,
            name: d.name || '',
            description: d.description || '',
            features: d.features || [],
            images: d.images || [],
            price: d.price || '',
            duration: d.duration || '',
            category: d.category || '',
          } as Package);
        });
        setPackages(data);
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const openBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-dialog'));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-950 py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/ifr.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6">
              <Clock className="w-4 h-4" />
              Time Building
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Build hours,
              <br />
              <span className="text-amber-400">build your future</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
              Already have your certificate? Build flight hours toward your ATP minimums with our well-maintained fleet at competitive rates.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={openBooking}
                className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-7 py-3 text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 cursor-pointer"
              >
                <Plane className="w-4 h-4 mr-2 -rotate-45" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-amber-500 mb-2">
              Our Packages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Time building packages
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-80" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <p className="text-gray-500 text-lg">No packages available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => {
                const gradients = [
                  'from-amber-500 to-amber-600',
                  'from-orange-500 to-orange-600',
                  'from-yellow-600 to-yellow-700',
                  'from-red-500 to-red-600',
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <div
                    key={pkg.id || index}
                    onClick={() => router.push(`/program/${programNameToSlug(pkg.name)}`)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image / Gradient */}
                    <div className="relative h-48">
                      {pkg.images && pkg.images.length > 0 ? (
                        <Image
                          src={pkg.images[0].large || pkg.images[0].medium || pkg.images[0].original}
                          alt={pkg.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {pkg.duration && (
                            <span className="text-sm text-white/70">{pkg.duration}</span>
                          )}
                          {pkg.price && (
                            <span className="text-sm font-semibold text-amber-300">{pkg.price}</span>
                          )}
                        </div>
                      </div>
                      {pkg.category && (
                        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white border border-white/10">
                          {pkg.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {pkg.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                      )}

                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {pkg.features.slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      )}

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 uppercase tracking-wide group-hover:gap-2.5 transition-all duration-200">
                        View Package
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

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to start building hours?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Get in touch and we&apos;ll help you pick the right package for your goals.
          </p>
          <Button
            onClick={openBooking}
            className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3 text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 cursor-pointer"
          >
            <Plane className="w-4 h-4 mr-2 -rotate-45" />
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}
