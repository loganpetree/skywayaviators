'use client';

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { incrementPageLoadCount } from "@/lib/firebase";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { AircraftImageCarousel } from "@/components/AircraftImageCarousel";
import { useAircraftStore } from "@/stores/aircraftStore";
import { Aircraft } from "@/types/aircraft";

export default function Home() {
  const router = useRouter();
  const { aircraft, loading, error, fetchAircraft, fetched } = useAircraftStore();

  // Fetch aircraft data from store if not already fetched
  useEffect(() => {
    console.log('🏠 Main Page:', {
      aircraftCount: aircraft.length,
      loading,
      fetched,
      error
    })

    if (!fetched) {
      console.log('🔄 Main Page: Fetching aircraft...')
      fetchAircraft();
    }
  }, [fetched, fetchAircraft, aircraft.length, loading, error]);

  // Program cards data for carousel
  const programCards = [
    <div key="private-pilot" className="relative flex h-72 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[32rem] md:w-96 cursor-pointer">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <div className="relative z-40 p-8">
        <p className="text-left font-sans text-sm font-medium text-white md:text-base">
          Starting at $15,000
        </p>
        <h3 className="mt-1 max-w-xs text-left font-sans text-xl font-semibold text-white md:text-3xl">
          Private Pilot
        </h3>
      </div>
      <Image
        src="/private-pilot-card.png"
        alt="Private Pilot Certificate"
        fill
        className="absolute inset-0 z-10 object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>,
    <div key="instrument-pilot" className="relative flex h-72 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[32rem] md:w-96 cursor-pointer">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <div className="relative z-40 p-8">
        <p className="text-left font-sans text-sm font-medium text-white md:text-base">
          Starting at $8,000
        </p>
        <h3 className="mt-1 max-w-xs text-left font-sans text-xl font-semibold text-white md:text-3xl">
          Instrument Pilot
        </h3>
      </div>
      <Image
        src="/ifr.png"
        alt="Instrument Pilot Training"
        fill
        className="absolute inset-0 z-10 object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>,
    <div key="commercial-pilot" className="relative flex h-72 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[32rem] md:w-96 cursor-pointer">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <div className="relative z-40 p-8">
        <p className="text-left font-sans text-sm font-medium text-white md:text-base">
          Starting at $35,000
        </p>
        <h3 className="mt-1 max-w-xs text-left font-sans text-xl font-semibold text-white md:text-3xl">
          Commercial Pilot
        </h3>
      </div>
      <Image
        src="/commercial-card.png"
        alt="Commercial Pilot Training"
        fill
        className="absolute inset-0 z-10 object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>,
    <div key="placeholder-program" className="relative flex h-72 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[32rem] md:w-96 cursor-pointer">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <div className="relative z-40 p-8">
        <p className="text-left font-sans text-sm font-medium text-white md:text-base">
          Starting at $5,000
        </p>
        <h3 className="mt-1 max-w-xs text-left font-sans text-xl font-semibold text-white md:text-3xl">
          Advanced Rating
        </h3>
      </div>
      <Image
        src="/plane.png"
        alt="Advanced Rating Training"
        fill
        className="absolute inset-0 z-10 object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  ];

  const testimonials = [
    {
      quote: "I built around 500 hours as a time builder with Skyway Aviators, and as a First Officer at Republic Airways, I can confidently say I couldn't have achieved that without them. The aircraft availability was consistent, and the maintenance control was top-notch.",
      name: "Austin Liu",
      designation: "First Officer, Republic Airways",
      src: "/hero-image.png",
      rating: 5
    },
    {
      quote: "Great flight school project, fairly easy to get scheduled, especially so if you plan your flights several days out. I came here from New York to finish my 150 hours. Planes are kept in great shape and the on-site mechanics were quick to respond.",
      name: "Chriss Handlly",
      designation: "Flight Student",
      src: "/hero-image.png",
      rating: 5
    },
    {
      quote: "My son flew 100 hours in a month, but some days weather was bad, and sometimes the airplane was grounded. But the good thing is that they have their mechanic in the field and he took care of it immediately. Thank God for the staff.",
      name: "Frankie Arreguin",
      designation: "Parent",
      src: "/hero-image.png",
      rating: 5
    },
  ];

  useEffect(() => {
    // Increment page load count on page load
    incrementPageLoadCount();
  }, []);


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
              <a href="#fleet" className="text-gray-900  px-3 py-2 text-sm font-bold">
                Fleet
              </a>
              <a href="#" className="text-gray-900  px-3 py-2 text-sm font-bold">
                Careers
              </a>
              <a href="#" className="text-gray-900  px-3 py-2 text-sm font-bold">
                Programs
              </a>
              <a href="#" className="text-gray-900  px-3 py-2 text-sm font-bold">
                Finance
              </a>
              <a href="#" className="text-gray-900  px-3 py-2 text-sm font-bold">
                Time Build
              </a>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book Flight
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-gray-50" style={{
        backgroundImage: `url('/N218YZ/9C767A92ED0B_ID.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/80"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-center">
            {/* Centered Content */}
            <div className="space-y-8 text-center max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Part 61 Certified with 141 Pending
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                  From Zero to 1,500
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed">
                  Transform your dreams into reality with Lancaster&apos;s premier flight training. Join hundreds of successful pilots who started their aviation careers with us.
                </p>
              </div>

              {/* Sub Description - Stats */}
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">5/5 Rating Average</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-semibold">Over 170 Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section
        className="py-16 bg-white relative overflow-hidden"
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
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We take you from zero flight experience to ATP certification and everywhere in between
            </p>
          </div>
        </div>

        {/* Carousel outside container for full-width scrolling */}
        <div className="pl-4 sm:pl-6 lg:pl-8">
          <Carousel items={programCards} />
        </div>

        {/* Financing Modal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            className="relative rounded-3xl p-10 md:p-12 text-center text-white shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(76, 71, 236, 0.95) 0%, rgba(99, 102, 241, 0.95) 50%, rgba(139, 92, 246, 0.95) 100%)'
            }}
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-lg translate-y-6 -translate-x-6"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative z-10">

              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
                Easy Financing Available
              </h3>

              <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
                Take the first step towards your aviation career with flexible financing options through
                <span className="font-semibold text-white"> Wurthy</span>.
                Start your training today with affordable monthly payments tailored to your needs.
              </p>

              <Button className="bg-white text-indigo-600 hover:bg-gray-50 font-bold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Learn About Financing
              </Button>

              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-75">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>No Credit Check Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Flexible Terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Quick Approval</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Fleet
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl">
                Choose from our premium fleet of aircraft, each selected for comfort, safety, and performance
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-8 flex-shrink-0">
              Show All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Loading placeholders */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : aircraft.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No aircraft available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aircraft.map((plane: Aircraft) => (
                <div
                  key={plane.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => router.push(`/aircraft/${plane.tailNumber}`)}
                >
                  <AircraftImageCarousel
                    images={plane.images?.map((img) => img.large) || []}
                    alt={`${plane.type} ${plane.model} ${plane.tailNumber} Aircraft`}
                    loading={loading}
                  />
                  {plane.equipment && plane.equipment.includes('IFR') && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-20">
                      IFR Equipped
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plane.type} {plane.model}</h3>
                      <span className="text-sm text-gray-500 font-medium">{plane.tailNumber}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Up to {plane.capacity} occupants</span>
                      <span className="text-sm text-gray-500">${plane.hourlyRate}/hr</span>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/aircraft/${plane.tailNumber}`);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Time Building Packages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Time Building Packages
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl">
                Accelerate your flight experience with our structured time building programs designed for aspiring professional pilots
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-8 flex-shrink-0">
              View All Packages
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Package 1 - Starter Package */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-xl font-bold">Starter Package</h3>
                  <p className="text-lg font-semibold">25 Hours</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Perfect for building initial experience and gaining confidence in single-engine aircraft.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">$1,625</span>
                  <span className="text-sm text-gray-500 ml-2">($65/hr)</span>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• 25 flight hours</li>
                  <li>• Cessna 150 aircraft</li>
                  <li>• Solo flight privileges</li>
                  <li>• Progress tracking</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Package
                </Button>
              </div>
            </div>

            {/* Package 2 - Professional Package */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold">Professional Package</h3>
                  <p className="text-lg font-semibold">50 Hours</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Comprehensive package for serious pilots pursuing commercial certifications and advanced ratings.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">$2,750</span>
                  <span className="text-sm text-gray-500 ml-2">($55/hr)</span>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• 50 flight hours</li>
                  <li>• Cessna 150 aircraft</li>
                  <li>• Cross-country flights</li>
                  <li>• Performance logbook</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Package
                </Button>
              </div>
            </div>

            {/* Package 3 - Elite Package */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h3 className="text-xl font-bold">Elite Package</h3>
                  <p className="text-lg font-semibold">100 Hours</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Ultimate time building experience with premium aircraft and personalized flight planning.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">$4,500</span>
                  <span className="text-sm text-gray-500 ml-2">($45/hr)</span>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• 100 flight hours</li>
                  <li>• Cessna 150 aircraft</li>
                  <li>• Custom flight routes</li>
                  <li>• Dedicated instructor</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Package
                </Button>
              </div>
            </div>

            {/* Package 4 - Ultimate Package */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-bold">Ultimate Package</h3>
                  <p className="text-lg font-semibold">500 Hours</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Maximum time building experience for professional pilots seeking extensive flight experience.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">$21,500</span>
                  <span className="text-sm text-gray-500 ml-2">($43/hr)</span>
                </div>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• 500 flight hours</li>
                  <li>• Cessna 150 aircraft</li>
                  <li>• Advanced flight planning</li>
                  <li>• Comprehensive logbook</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Package
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Customer Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real experiences from pilots, students, and aviation enthusiasts who trust Skyway Aviators
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <AnimatedTestimonials testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Your page content goes here */}
      </main>

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
                <li><a href="#" className="text-sm ">Fleet</a></li>
                <li><a href="#" className="text-sm ">Careers</a></li>
                <li><a href="#" className="text-sm ">Programs</a></li>
                <li><a href="#" className="text-sm ">Finance</a></li>
                <li><a href="#" className="text-sm ">Time Build</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="text-sm ">Charter Flights</a></li>
                <li><a href="#" className="text-sm ">Aircraft Management</a></li>
                <li><a href="#" className="text-sm ">Maintenance</a></li>
                <li><a href="#" className="text-sm ">Pilot Training</a></li>
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
