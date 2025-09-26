'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Aircraft } from "@/types/aircraft";

interface FleetSectionProps {
  aircraft: Aircraft[];
  loading: boolean;
}

export default function FleetSection({ aircraft, loading }: FleetSectionProps) {
  const router = useRouter();


  return (
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
                {plane.images && plane.images.length > 0 ? (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={plane.images[0].large || plane.images[0].medium || plane.images[0].original}
                      alt={`${plane.type} ${plane.model} ${plane.tailNumber} Aircraft`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image available</span>
                  </div>
                )}
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
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
