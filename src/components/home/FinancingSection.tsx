'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, Sparkles, ArrowRight } from "lucide-react";

export default function FinancingSection() {
  return (
    <section id="finance" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-5">
          <span className="text-7xl md:text-8xl font-black text-gray-300 leading-none select-none">
            2
          </span>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-1">
              Step Two
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Secure your financing
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3 ml-auto flex-1 justify-end">
            <div className="flex-1 max-w-[200px] h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">2 / 3</span>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 40%)',
          }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 md:p-12 lg:p-16">
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
