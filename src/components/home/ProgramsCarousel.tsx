'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { Program } from "@/types/program";

interface ProgramsCarouselProps {
  programs: Program[];
  programsLoading: boolean;
}

export default function ProgramsCarousel({ programs, programsLoading }: ProgramsCarouselProps) {
  const router = useRouter();

  const programNameToSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateProgramCards = () => {
    if (programsLoading || programs.length === 0) {
      return [];
    }

    return programs.map((program, index) => {
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
    <section id="programs-carousel" className="py-16 bg-white">
      <div className="pl-4 sm:pl-6 lg:pl-8">
        {programsLoading ? (
          <div className="flex space-x-4">
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
    </section>
  );
}
