import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { label: 'Flight School', href: '/flightschool' },
  { label: 'Time Building', href: '/timebuilding' },
  { label: 'Financing', href: '/#finance' },
  { label: 'Fleet', href: '/#fleet' },
  { label: 'Reviews', href: '/#careers' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <Image
                src="/skyway-logo.webp"
                alt="Skyway Aviators"
                width={96}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                Skyway Aviators
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Lancaster&apos;s premier flight training. From private pilot to ATP — we get you there.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="tel:+14699284678" className="hover:text-white transition-colors">
                  (469) 928-4678
                </a>
              </li>
              <li>
                <a href="mailto:info@skywayaviators.com" className="hover:text-white transition-colors">
                  info@skywayaviators.com
                </a>
              </li>
              <li className="pt-1 leading-relaxed">
                730 Ferris Rd. Suite 102<br />
                Lancaster, TX 75146
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Hours
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Monday – Sunday<br />
              Sunrise to Sunset
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Skyway Aviators. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Lancaster Regional Airport (KLNC)
          </p>
        </div>
      </div>
    </footer>
  );
}
