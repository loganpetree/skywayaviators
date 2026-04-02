interface HeroSectionProps {
  fleetSize?: number;
}

export default function HeroSection({ fleetSize }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gray-900 min-h-[85vh] flex items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/videos/skyway-clips.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-24">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <div
            className="animate-hero-fade-up inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-widest uppercase backdrop-blur-sm border border-white/10 mb-6"
            style={{ animationDelay: '0.1s' }}
          >
            <svg className="w-4 h-4 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Part 61 Certified &middot; 141 Pending
          </div>

          <h1
            className="animate-hero-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6"
            style={{ animationDelay: '0.25s' }}
          >
            Skyway Aviators
          </h1>

          <p
            className="animate-hero-fade-up text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed"
            style={{ animationDelay: '0.45s' }}
          >
            Lancaster&apos;s premier flight training. Join hundreds of successful pilots who started their aviation careers with us.
          </p>

          {/* Stats */}
          <div
            className="animate-hero-fade-up flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">170+</span>
              <span className="text-sm text-white/50">Students</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{fleetSize || '—'}</span>
              <span className="text-sm text-white/50">Aircraft</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">5.0</span>
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-white/50">Rating</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Part 61</span>
              <span className="text-sm text-white/50">Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
