'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { Button } from "@/components/ui/button";
import { Program } from "@/types/program";

interface ProgramsSectionProps {
  programs: Program[];
  programsLoading: boolean;
}

export default function ProgramsSection({ programs, programsLoading }: ProgramsSectionProps) {
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

  // Generate dynamic program cards from Firebase data
  const generateProgramCards = () => {
    if (programsLoading || programs.length === 0) {
      return [];
    }

    return programs.map((program, index) => {
      // Define gradient colors for different programs
      const gradients = [
        "from-orange-500 to-orange-600",
        "from-red-500 to-red-600",
        "from-indigo-500 to-indigo-600",
        "from-purple-500 to-purple-600",
        "from-green-500 to-green-600",
        "from-blue-500 to-blue-600"
      ];
      const gradient = gradients[index % gradients.length];

      return (
        <div
          key={program.id || index}
          className="relative flex h-72 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[32rem] md:w-96 cursor-pointer hover:shadow-xl transition-shadow duration-300"
          onClick={() => program.name && router.push(`/program/${programNameToSlug(program.name)}`)}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          <div className="relative z-40 p-8">
            <p className="text-left font-sans text-sm font-medium text-white md:text-base">
              Zero to
            </p>
            <h3 className="mt-1 max-w-xs text-left font-sans text-xl font-semibold text-white md:text-3xl">
              {program.name}
            </h3>
          </div>
          {program.images && program.images.length > 0 ? (
            <Image
              src={program.images[0].large || program.images[0].medium || program.images[0].original}
              alt={program.name}
              fill
              className="absolute inset-0 z-10 object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className={`absolute inset-0 z-10 bg-gradient-to-br ${gradient} transition-transform duration-300 hover:scale-105`} />
          )}
        </div>
      );
    });
  };

  return (
    <section
      id="programs"
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
        {programsLoading ? (
          <div className="flex space-x-4">
            {/* Loading placeholders */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-shrink-0 h-72 w-56 md:h-[32rem] md:w-96 rounded-3xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No programs available at the moment.</p>
          </div>
        ) : (
          <Carousel items={generateProgramCards()} />
        )}
      </div>

      {/* Financing Modal */}
      <div id="finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
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
  );
}
