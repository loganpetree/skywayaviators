'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { Button } from "@/components/ui/button";
import { Program } from "@/types/program";
import { ShieldCheck, Clock, Sparkles, ArrowRight } from "lucide-react";

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

      {/* Financing Section */}
      <div id="finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 40%)',
          }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 md:p-12 lg:p-16">
            {/* Left: Copy & CTA */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2.5 mb-5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-indigo-300/70">Powered by</span>
                <Image
                  src="/wurthy-logo.svg"
                  alt="Wurthy"
                  width={80}
                  height={18}
                  className="h-[18px] w-auto opacity-70"
                />
              </span>

              <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white tracking-tight leading-tight mb-5">
                Focus on Flying,
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Not Finances
                </span>
              </h3>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mb-8">
                Flexible financing lets you start training today with affordable monthly payments.
                No upfront burden — just a clear path from student pilot to the flight deck.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-7 py-3 text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 transition-all duration-200 cursor-pointer">
                  Apply for Financing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="md:col-span-2 grid grid-cols-1 gap-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'No Credit Check',
                  desc: 'Get approved based on your earning potential, not your credit score.',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10 border-emerald-500/20',
                },
                {
                  icon: Clock,
                  title: 'Quick Approval',
                  desc: 'Apply in minutes and get a decision the same day.',
                  color: 'text-sky-400',
                  bg: 'bg-sky-500/10 border-sky-500/20',
                },
                {
                  icon: Sparkles,
                  title: 'Flexible Terms',
                  desc: 'Monthly payments designed to fit a student pilot budget.',
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10 border-purple-500/20',
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className={`flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm ${feat.bg}`}
                >
                  <div className={`mt-0.5 flex-shrink-0 ${feat.color}`}>
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-gray-400">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
