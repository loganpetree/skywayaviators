'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Package } from "@/types/package";

interface TimeBuildingSectionProps {
  packages: Package[];
  packagesLoading: boolean;
}

export default function TimeBuildingSection({ packages, packagesLoading }: TimeBuildingSectionProps) {
  const router = useRouter();

  // Function to convert program name to URL slug
  const programNameToSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  return (
    <section id="time-build" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Time Building Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              Accelerate your flight experience with our structured time building programs designed for aspiring professional pilots
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-8 flex-shrink-0">
            View All Programs
          </Button>
        </div>

        {packagesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loading placeholders */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No packages available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => {
              // Define gradient colors for different packages
              const gradients = [
                "from-orange-500 to-orange-600",
                "from-red-500 to-red-600",
                "from-indigo-500 to-indigo-600",
                "from-purple-500 to-purple-600"
              ];
              const gradient = gradients[index % gradients.length];

              // Define icons for different packages
              const icons = [
                <svg key="bolt" className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>,
                <svg key="check" className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>,
                <svg key="star" className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>,
                <svg key="certificate" className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ];
              const icon = icons[index % icons.length];

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => pkg.name && router.push(`/program/${programNameToSlug(pkg.name)}`)}
                >
                  <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                    {pkg.images && pkg.images.length > 0 && (
                      <Image
                        src={pkg.images[0].medium || pkg.images[0].original}
                        alt={pkg.name}
                        fill
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center text-white">
                      {icon}
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      {pkg.category && (
                        <p className="text-sm opacity-90 mt-1">{pkg.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      {pkg.duration && (
                        <span className="text-sm text-gray-600">{pkg.duration}</span>
                      )}
                      {pkg.price && (
                        <span className="text-lg font-bold text-gray-900">{pkg.price}</span>
                      )}
                    </div>

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="text-sm text-gray-600 mb-4 space-y-1">
                        {pkg.features.slice(0, 4).map((feature, featureIndex) => (
                          <li key={featureIndex}>• {feature}</li>
                        ))}
                        {pkg.features.length > 4 && (
                          <li className="text-gray-500">• And {pkg.features.length - 4} more features...</li>
                        )}
                      </ul>
                    )}

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book Package
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
