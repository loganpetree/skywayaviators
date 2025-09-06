'use client';

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AircraftImageCarousel } from '@/components/AircraftImageCarousel'

// Aircraft data
const aircraftData = {
  'N7774A': {
    name: 'CESSNA 172F',
    tailNumber: 'N7774A',
    images: [
      "/N7774A/FD92E9C557B6_IDa.jpg",
      "/N7774A/34EB87791B5D_ID.jpg",
      "/N7774A/783EF3A33AED_ID.jpg",
      "/N7774A/A4CCF3658C36_ID.jpg",
      "/N7774A/A82A01ACAF86_ID.jpg",
      "/N7774A/B2914FEF8332_ID.jpg",
      "/N7774A/C138685E0DD8_ID.jpg",
      "/N7774A/F43DCA2EDC01_ID.jpg",
      "/N7774A/FD92E9C557B6_ID.jpg"
    ],
    description: 'Perfect for short to medium-range flights with exceptional comfort and speed.',
    specifications: {
      passengers: 'Up to 4 occupants',
      range: '695 nautical miles',
      speed: '140 knots cruise',
      engine: 'Continental O-300',
      features: ['IFR Equipped', 'GPS Navigation', 'Autopilot']
    },
    pricing: {
      hourly: '$170/hr',
      blockHours: '$150/hr (5+ hours)'
    },
    location: 'Lancaster, TX',
    totalFlightHours: 12500,
    yearsOfService: 15,
    certifications: ['IFR Certified', 'GPS Equipped', 'Autopilot Ready']
  },
  'N2500Q': {
    name: 'PIPER PA-28',
    tailNumber: 'N2500Q',
    images: [
      "/N2500Q/8DE8218EE4CF_ID.jpg",
      "/N2500Q/7FECF156B295_ID.jpg",
      "/N2500Q/9A5031CE2B04_ID.jpg",
      "/N2500Q/B540408DB70D_ID.jpg",
      "/N2500Q/B7D4FDF9FBAC_ID.jpg",
      "/N2500Q/F88897932D34_ID.jpg"
    ],
    description: 'Perfect for short trips and personal travel with exceptional efficiency.',
    specifications: {
      passengers: 'Up to 2 occupants',
      range: '500 nautical miles',
      speed: '120 knots cruise',
      engine: 'Lycoming O-235',
      features: ['VFR Navigation', 'GPS', 'Intercom']
    },
    pricing: {
      hourly: '$90/hr',
      blockHours: '$80/hr (5+ hours)'
    },
    location: 'Lancaster, TX',
    totalFlightHours: 8900,
    yearsOfService: 12,
    certifications: ['VFR Certified', 'GPS Equipped', 'Dual Controls']
  },
  'N218YZ': {
    name: 'CESSNA 150',
    tailNumber: 'N218YZ',
    images: [
      "/N218YZ/9C767A92ED0B_ID.jpg",
      "/N218YZ/27451B3D1D70_ID.jpg",
      "/N218YZ/921E7FAAF989_ID.jpg",
      "/N218YZ/A2BA798A951F_ID.jpg",
      "/N218YZ/BD862FCFED31_ID.jpg",
      "/N218YZ/E1F50B271DD2_ID.jpg"
    ],
    description: 'Reliable and efficient aircraft perfect for personal and business travel.',
    specifications: {
      passengers: 'Up to 2 occupants',
      range: '350 nautical miles',
      speed: '110 knots cruise',
      engine: 'Continental O-200',
      features: ['VFR Navigation', 'Basic GPS', 'Dual Controls']
    },
    pricing: {
      hourly: '$90/hr',
      blockHours: '$80/hr (5+ hours)'
    },
    location: 'Lancaster, TX',
    totalFlightHours: 7200,
    yearsOfService: 18,
    certifications: ['VFR Certified', 'Basic GPS', 'Training Ready']
  }
};

// Type definitions
interface AircraftData {
  name: string;
  tailNumber: string;
  images: string[];
  description: string;
  specifications: {
    passengers: string;
    range: string;
    speed: string;
    engine: string;
    features: string[];
  };
  pricing: {
    hourly: string;
    blockHours: string;
  };
  location: string;
  totalFlightHours: number;
  yearsOfService: number;
  certifications: string[];
}

export default function AircraftDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tailNumber = params.tailNumber as string

  const [aircraft, setAircraft] = useState<AircraftData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch aircraft data
  useEffect(() => {
    if (!tailNumber) return

    try {
      setLoading(true)
      const aircraftInfo = aircraftData[tailNumber as keyof typeof aircraftData]

      if (aircraftInfo) {
        setAircraft(aircraftInfo)
      } else {
        router.push('/#fleet')
      }
    } catch (err) {
      console.error('Error fetching aircraft:', err)
      router.push('/#fleet')
    } finally {
      setLoading(false)
    }
  }, [tailNumber, router])

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading aircraft details...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (!aircraft) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Aircraft not found</h2>
          <p className="text-gray-500 text-sm mb-8">The aircraft you are looking for does not exist.</p>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="px-6"
          >
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <button
                onClick={() => router.push('/')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-blue-600"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/#fleet')}
                className="text-gray-900 px-3 py-2 text-sm font-bold hover:text-blue-600"
              >
                Fleet
              </button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book Flight
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Aircraft Detail Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </button>

          {/* Full Width Image Gallery */}
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              <AircraftImageCarousel
                images={aircraft.images}
                alt={`${aircraft.name} ${aircraft.tailNumber} Aircraft`}
              />
            </div>
          </div>

          {/* Aircraft Information */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {aircraft.name}
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                  {aircraft.tailNumber}
                </p>
                <p className="text-gray-600 mt-4">
                  {aircraft.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Hourly Rate</span>
                    <span className="text-2xl font-bold text-blue-600">{aircraft.pricing.hourly}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Block Hours (5+ hours)</span>
                    <span className="text-xl font-semibold text-blue-600">{aircraft.pricing.blockHours}</span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Capacity & Performance</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>Occupants:</strong> {aircraft.specifications.passengers}</li>
                      <li><strong>Range:</strong> {aircraft.specifications.range}</li>
                      <li><strong>Cruise Speed:</strong> {aircraft.specifications.speed}</li>
                      <li><strong>Engine:</strong> {aircraft.specifications.engine}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                    <ul className="space-y-2 text-gray-600">
                      {aircraft.specifications.features.map((feature: string, index: number) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Ready to Fly?</h3>
                <p className="mb-4 opacity-90">
                  Book this aircraft for your next flight experience.
                </p>
                <Button className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-8 py-3 text-lg">
                  Book {aircraft.tailNumber}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2022 Skyway Aviators. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

