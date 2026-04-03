'use client';

import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function BookFlightSection() {
  const handleBook = () => {
    window.dispatchEvent(new CustomEvent('open-booking-dialog'));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-5">
          <span className="text-7xl md:text-8xl font-black text-gray-300 leading-none select-none">
            3
          </span>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-1">
              Step Three
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Book your first flight
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Schedule a discovery flight or training session at Lancaster Regional Airport near Dallas, TX.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 ml-auto flex-1 justify-end">
            <div className="flex-1 max-w-[200px] h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">3 / 3</span>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gray-900">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: 'url(/hero-image.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
              Ready to take the controls?
            </h3>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-8">
              Book a discovery flight and experience what it&apos;s like to fly. No experience needed — just bring your excitement.
            </p>
            <Button
              onClick={handleBook}
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 py-3 text-sm rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30 transition-all duration-200 cursor-pointer"
            >
              <Plane className="w-4 h-4 mr-2 -rotate-45" />
              Book a Discovery Flight
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
