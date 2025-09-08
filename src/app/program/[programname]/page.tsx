'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { Program } from "@/types/program";
import { AircraftImageCarousel } from "@/components/AircraftImageCarousel";
import { RequestDialog } from "@/components/RequestDialog";

// Utility function to convert program name to URL slug
function programNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Utility function to convert URL slug back to program name
function slugToProgramName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()); // Title case
}

export default function ProgramDetail() {
  const params = useParams();
  const programSlug = params.programname as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        // Convert slug back to program name for searching
        const programName = slugToProgramName(programSlug);

        // Query all programs and find the one with matching name
        const querySnapshot = await getDocs(collection(db, "programs"));
        let foundProgram: Program | null = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name && programNameToSlug(data.name) === programSlug) {
            foundProgram = {
              id: doc.id,
              ...data,
              name: data.name || '',
              description: data.description || '',
              features: data.features || [],
              images: data.images || [],
              price: data.price || ''
            } as Program;
          }
        });

        if (foundProgram) {
          setProgram(foundProgram);
        } else {
          setError("Program not found");
        }
      } catch (err) {
        console.error("Error fetching program:", err);
        setError("Failed to load program");
      } finally {
        setLoading(false);
      }
    };

    if (programSlug) {
      fetchProgram();
    }
  }, [programSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {error || "Program Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              The program you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-transparent">
      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Image
                src="/skyway-logo.webp"
                alt="Skyway Aviators Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Skyway Aviators
                </h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 px-3 py-2 text-sm font-bold">
                Home
              </Link>
              <Link href="/#fleet" className="text-gray-900 px-3 py-2 text-sm font-bold">
                Fleet
              </Link>
              <Link href="/#programs" className="text-gray-900 px-3 py-2 text-sm font-bold">
                Programs
              </Link>
              <Link href="#" className="text-gray-900 px-3 py-2 text-sm font-bold">
                Careers
              </Link>
              <Link href="#" className="text-gray-900 px-3 py-2 text-sm font-bold">
                Finance
              </Link>
              <Link href="#" className="text-gray-900 px-3 py-2 text-sm font-bold">
                Time Build
              </Link>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book Flight
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Flight Training Program
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                  {program.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed">
                  {program.description.replace(/'/g, '&apos;')}
                </p>
              </div>

              {program.price && (
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {program.price}
                  </div>
                </div>
              )}
            </div>

            {/* Image */}
            <div className="relative w-full">
              {program.images && program.images.length > 0 ? (
                <div className="relative h-80 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden">
                  <AircraftImageCarousel
                    images={program.images.map(img => img.large || img.medium || img.original)}
                    alt={program.name}
                    loading={false}
                    className="h-full rounded-2xl"
                  />
                </div>
              ) : (
                <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-bold">{program.name}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {program.features && program.features.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What&apos;s Included
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to successfully complete your flight training program
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {program.features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Aviation Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful pilots who have trained with Skyway Aviators
          </p>
          <div className="flex justify-center">
            <RequestDialog programName={program.name} interestType="course">
              <Button className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Contact for Details
              </Button>
            </RequestDialog>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
              <div className="space-y-2 text-gray-300">
                <p className="text-sm">
                  <span className="font-medium">Office:</span><br />
                  730 Ferris Rd. Suite 102<br />
                  Lancaster, Tx 75146
                </p>
                <p className="text-sm">
                  <span className="font-medium">Call:</span><br />
                  +1(469)9284-678
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span><br />
                  info@skywayaviators.com
                </p>
                <p className="text-sm">
                  <span className="font-medium">Site:</span><br />
                  skywayaviators.com
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/" className="text-sm">Home</Link></li>
                <li><Link href="/#fleet" className="text-sm">Fleet</Link></li>
                <li><Link href="/#programs" className="text-sm">Programs</Link></li>
                <li><Link href="#" className="text-sm">Finance</Link></li>
                <li><Link href="#" className="text-sm">Time Build</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="text-sm">Charter Flights</Link></li>
                <li><Link href="#" className="text-sm">Aircraft Management</Link></li>
                <li><Link href="#" className="text-sm">Maintenance</Link></li>
                <li><Link href="#" className="text-sm">Pilot Training</Link></li>
              </ul>
            </div>

            {/* Chat Widget */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Questions?</h3>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 font-semibold text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Have a question?</p>
                    <p className="text-xs text-gray-400">Text us here</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2022 Skyway Aviators. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
