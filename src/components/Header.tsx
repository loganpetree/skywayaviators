'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onBookingClick: () => void;
}

export default function Header({ onBookingClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Map navigation tabs to section IDs
  const sectionMap: Record<string, string> = {
    'Fleet': 'fleet',
    'Careers': 'careers',
    'Programs': 'programs',
    'Finance': 'finance',
    'Time Build': 'time-build'
  };

  // Handle navigation tab clicks
  const handleNavigation = (tabName: string) => {
    const isHomePage = pathname === '/';
    const sectionId = sectionMap[tabName];

    if (!sectionId) return; // Skip if not a section tab

    if (isHomePage) {
      // Scroll to section on current page
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage with section hash
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-4 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/skyway-logo.webp"
                alt="Skyway Aviators Logo - Go to homepage"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Skyway Aviators
                </h1>
              </div>
            </button>

            {/* Navigation Tabs - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-gray-700 transition-colors">
                Home
              </Link>
              <button
                onClick={() => handleNavigation('Fleet')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-gray-700 transition-colors cursor-pointer"
              >
                Fleet
              </button>
              <button
                onClick={() => handleNavigation('Careers')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-gray-700 transition-colors cursor-pointer"
              >
                Careers
              </button>
              <button
                onClick={() => handleNavigation('Programs')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-gray-700 transition-colors cursor-pointer"
              >
                Programs
              </button>
              <button
                onClick={() => handleNavigation('Finance')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-gray-700 transition-colors cursor-pointer"
              >
                Finance
              </button>
              <button
                onClick={() => handleNavigation('Time Build')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-gray-700 transition-colors cursor-pointer"
              >
                Time Build
              </button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onBookingClick}
              >
                Book Flight
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/skyway-logo.webp"
                    alt="Skyway Aviators Logo"
                    width={100}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <span className="text-lg font-bold text-gray-900">Skyway Aviators</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex-1 px-4 py-6 space-y-1">
                <Link
                  href="/"
                  className="block px-4 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <button
                  className="block w-full text-left px-4 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    handleNavigation('Fleet');
                    setMobileMenuOpen(false);
                  }}
                >
                  Fleet
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    handleNavigation('Careers');
                    setMobileMenuOpen(false);
                  }}
                >
                  Careers
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    handleNavigation('Programs');
                    setMobileMenuOpen(false);
                  }}
                >
                  Programs
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    handleNavigation('Finance');
                    setMobileMenuOpen(false);
                  }}
                >
                  Finance
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    handleNavigation('Time Build');
                    setMobileMenuOpen(false);
                  }}
                >
                  Time Build
                </button>
                <div className="pt-4 border-t">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onBookingClick();
                    }}
                  >
                    Book Flight
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
