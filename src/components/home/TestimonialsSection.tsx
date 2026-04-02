'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "I built around 500 hours as a time builder with Skyway Aviators, and as a First Officer at Republic Airways, I can confidently say I couldn't have achieved that without them. The aircraft availability was consistent, and the maintenance control was top-notch.",
    name: "Austin Liu",
    designation: "First Officer, Republic Airways",
    rating: 5,
  },
  {
    quote: "Great flight school project, fairly easy to get scheduled, especially so if you plan your flights several days out. I came here from New York to finish my 150 hours. Planes are kept in great shape and the on-site mechanics were quick to respond.",
    name: "Chriss Handlly",
    designation: "Flight Student",
    rating: 5,
  },
  {
    quote: "My son flew 100 hours in a month, but some days weather was bad, and sometimes the airplane was grounded. But the good thing is that they have their mechanic in the field and he took care of it immediately. Thank God for the staff.",
    name: "Frankie Arreguin",
    designation: "Parent",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const current = testimonials[active];

  return (
    <section id="careers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: heading + nav */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm font-semibold text-gray-900 ml-1">5.0</span>
              <span className="text-sm text-gray-400 ml-1">on Google</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Trusted by pilots
              <br />
              <span className="text-gray-400">at every stage</span>
            </h2>

            <p className="text-gray-500 leading-relaxed mb-8 max-w-md">
              From first-time students to airline first officers — hear why pilots choose Skyway Aviators.
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400 ml-2">
                {active + 1} / {testimonials.length}
              </span>
            </div>
          </div>

          {/* Right: testimonial card */}
          <div className="relative">
            <Quote className="absolute -top-3 -left-2 w-10 h-10 text-sky-500/10" />

            <div className="relative bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm">
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 min-h-[120px]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="w-11 h-11 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sky-500 font-bold text-sm">
                    {current.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{current.name}</p>
                  <p className="text-sm text-gray-400">{current.designation}</p>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === active ? 'w-6 bg-sky-500' : 'w-1.5 bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
