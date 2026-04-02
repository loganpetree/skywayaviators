'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Menu, X, Plane } from "lucide-react";

interface HeaderProps {
  onBookingClick: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '/', sectionId: null },
  { label: 'Fleet', href: null, sectionId: 'fleet' },
  { label: 'Programs', href: null, sectionId: 'programs' },
  { label: 'Time Build', href: null, sectionId: 'time-build' },
  { label: 'Careers', href: null, sectionId: 'careers' },
  { label: 'Finance', href: null, sectionId: 'finance' },
] as const;

export default function Header({ onBookingClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = NAV_ITEMS
      .filter((item) => item.sectionId)
      .map((item) => item.sectionId as string);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isHomePage]);

  const handleNavigation = useCallback(
    (item: (typeof NAV_ITEMS)[number]) => {
      if (item.href) {
        router.push(item.href);
        return;
      }
      if (!item.sectionId) return;

      if (isHomePage) {
        document
          .getElementById(item.sectionId)
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`/#${item.sectionId}`);
      }
    },
    [isHomePage, router]
  );

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.href === '/' && isHomePage && !activeSection) return true;
    if (item.sectionId && activeSection === item.sectionId) return true;
    return false;
  };

  const headerBg = scrolled
    ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-200/60'
    : 'bg-transparent border-b border-transparent';

  const textColor = scrolled ? 'text-gray-700' : 'text-white/90';
  const textHover = scrolled ? 'hover:text-gray-900' : 'hover:text-white';
  const activeTextColor = scrolled ? 'text-gray-900' : 'text-white';
  const logoTextColor = scrolled ? 'text-gray-900' : 'text-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${headerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div className={`rounded-lg overflow-hidden transition-shadow duration-300 ${scrolled ? '' : 'shadow-lg shadow-black/20'}`}>
                <Image
                  src="/skyway-logo.webp"
                  alt="Skyway Aviators"
                  width={112}
                  height={36}
                  className="h-9 w-auto"
                  priority
                />
              </div>
              <span
                className={`hidden lg:block text-lg font-bold tracking-tight transition-colors duration-300 group-hover:opacity-80 ${logoTextColor}`}
              >
                Skyway Aviators
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-3 py-2 text-[13px] font-semibold tracking-wide uppercase transition-colors duration-200 ${
                      active
                        ? activeTextColor
                        : `${textColor} ${textHover}`
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-sky-400 rounded-full animate-nav-underline" />
                    )}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item)}
                    className={`relative px-3 py-2 text-[13px] font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer ${
                      active
                        ? activeTextColor
                        : `${textColor} ${textHover}`
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-sky-400 rounded-full animate-nav-underline" />
                    )}
                  </button>
                );
              })}

              <div className="ml-3 pl-3 border-l border-current/10">
                <Button
                  onClick={onBookingClick}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 cursor-pointer"
                >
                  <Plane className="w-4 h-4 mr-1.5 -rotate-45" />
                  Book Flight
                </Button>
              </div>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                scrolled
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white/90 hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[min(85vw,320px)] bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <Image
                src="/skyway-logo.webp"
                alt="Skyway Aviators"
                width={96}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-base font-bold text-gray-900">
                Skyway Aviators
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="flex flex-col px-4 py-5 gap-0.5">
            {NAV_ITEMS.map((item, i) => {
              const active = isActive(item);
              const sharedClasses = `flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                active
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`;

              const inner = (
                <>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                  )}
                  {item.label}
                </>
              );

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={sharedClasses}
                  style={{
                    animationDelay: `${i * 50}ms`,
                    animation: mobileMenuOpen
                      ? `mobile-slide-in 0.3s ease-out ${i * 50}ms both`
                      : 'none',
                  }}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    handleNavigation(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`${sharedClasses} cursor-pointer`}
                  style={{
                    animation: mobileMenuOpen
                      ? `mobile-slide-in 0.3s ease-out ${i * 50}ms both`
                      : 'none',
                  }}
                >
                  {inner}
                </button>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-gray-50/80">
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookingClick();
              }}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <Plane className="w-4 h-4 mr-2 -rotate-45" />
              Book Flight
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
