'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plane } from 'lucide-react';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';

export default function TimeBuildingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-dialog'));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-white py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/ifr.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/70" />


        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold tracking-widest uppercase mb-6">
              <Clock className="w-4 h-4" />
              Time Building
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-5">
              Fly for as low as
              <br />
              <span className="text-amber-500">$43/hr wet</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Already have your certificate? Build flight hours toward your ATP minimums with our well-maintained fleet — starting at just $43.00/hr wet.
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

      {/* Featured 50-Hour Deal */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gray-950 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
              {/* Left: Badge + Price */}
              <div className="flex-1 p-8 sm:p-10 lg:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Most Popular</span>
                </div>
                <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
                  50-Hour Block Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter leading-none">$45</span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white/40">.00</span>
                    <span className="text-sm font-medium text-white/30 -mt-1">/hr wet</span>
                  </div>
                </div>
                <p className="text-gray-400 text-base leading-relaxed max-w-sm mt-3">
                  Fuel included. No hidden fees. 50 hours of affordable stick time.
                </p>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-40 bg-white/10" />

              {/* Center: Stats + Features */}
              <div className="flex-1 px-8 sm:px-10 lg:px-12 pb-8 lg:pb-0">
                <div className="flex gap-6 mb-6">
                  <div>
                    <p className="text-2xl font-black text-white">50</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-amber-400">$2,250</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {['Fuel included in hourly rate', 'Fly on your schedule', 'Well-maintained fleet'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: CTA */}
              <div className="flex-shrink-0 p-8 sm:p-10 lg:p-12 w-full lg:w-auto">
                <Button
                  onClick={openBooking}
                  className="w-full lg:w-auto bg-amber-500 hover:bg-amber-400 text-white font-bold py-4 px-8 text-base rounded-2xl shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer"
                >
                  <Plane className="w-5 h-5 mr-2 -rotate-45" />
                  Claim This Rate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block Rate Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold tracking-widest uppercase text-amber-500 mb-3">
              Block Rates
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              More hours, better rates
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Lock in a block of hours and save. The more you fly, the less you pay per hour.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { hours: 50, rate: 45, total: 2250 },
              { hours: 100, rate: 43, total: 4300 },
              { hours: 300, rate: 40, total: 12000 },
            ].map((block) => (
              <div
                key={block.hours}
                onClick={openBooking}
                className="group relative rounded-2xl bg-gray-100 overflow-hidden cursor-pointer transition-all duration-300 aspect-[4/3] flex items-center justify-center hover:shadow-xl"
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="none" aria-hidden="true">
                  <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" className="fill-white transition-colors duration-300 group-hover:fill-gray-50" style={{ fontSize: '500px', fontWeight: 900, fontStyle: 'italic' }}>
                    {block.hours}
                  </text>
                </svg>

                <div className="relative z-10 text-center px-6">
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-2">
                    {block.hours}-hour block
                  </p>
                  <p className="text-3xl font-black text-gray-900 mb-1">
                    ${block.rate}<span className="text-lg font-bold text-gray-400">/hr</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    ${block.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} total
                  </p>
                </div>
              </div>
            ))}
          </div>
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

      {/* FAQ */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
