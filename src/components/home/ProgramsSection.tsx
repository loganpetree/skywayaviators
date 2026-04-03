'use client';

import { useRouter } from 'next/navigation';

export default function ProgramsSection() {
  const router = useRouter();

  return (
    <section
      id="programs"
      className="py-16 pb-10 bg-white relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
          radial-gradient(circle, rgba(139, 92, 246, 0.08) 1px, transparent 1px),
          radial-gradient(circle, rgba(76, 71, 236, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px, 30px 30px, 40px 40px',
        backgroundPosition: '0 0, 10px 10px, 20px 20px'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-5">
          <span className="text-7xl md:text-8xl font-black text-gray-300 leading-none select-none">
            1
          </span>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-1">
              Step One
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Select a path to get started
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Choose between flight school training programs or time-building packages to begin your aviation journey.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 ml-auto flex-1 justify-end">
            <div className="flex-1 max-w-[200px] h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">1 / 3</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Flight Training Card */}
          <button
            onClick={() => router.push('/flightschool')}
            className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-64 sm:h-72 text-left cursor-pointer border-2 border-transparent hover:border-sky-400/50 transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: 'url(/commercial-card.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5 group-hover:from-black/85 transition-colors duration-300" />
            <div className="relative z-10 p-6 sm:p-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1.5">
                Flight School
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm mb-4">
                From zero experience to certified pilot — private through CFI.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-sky-400 group-hover:gap-3 transition-all duration-200">
                Explore Programs
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </button>

          {/* Time Building Card */}
          <button
            onClick={() => router.push('/timebuilding')}
            className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-64 sm:h-72 text-left cursor-pointer border-2 border-transparent hover:border-amber-400/50 transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: 'url(/ifr.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5 group-hover:from-black/85 transition-colors duration-300" />
            <div className="relative z-10 p-6 sm:p-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1.5">
                Time Building
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm mb-4">
                Already rated? Build hours toward your ATP at competitive rates.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-amber-400 group-hover:gap-3 transition-all duration-200">
                View Packages
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
