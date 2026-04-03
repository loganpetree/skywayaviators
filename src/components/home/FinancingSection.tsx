'use client';

import Image from "next/image";
import Link from "next/link";
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
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Explore affordable flight training loans and flexible payment plans so cost never holds you back.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 ml-auto flex-1 justify-end">
            <div className="flex-1 max-w-[200px] h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">2 / 3</span>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#101424] via-[#0D2572] to-[#101424]" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(71, 198, 214, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(78, 98, 178, 0.3) 0%, transparent 40%)',
          }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#47C6D6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 md:p-12 lg:p-16">
            <div className="md:col-span-3 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2.5 mb-5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-[#47C6D6]/70">Powered by</span>
                <Image
                  src="/stratus-logo.png"
                  alt="Stratus Financial"
                  width={120}
                  height={20}
                  className="h-[20px] w-auto opacity-80"
                />
              </span>

              <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white tracking-tight leading-tight mb-5">
                Focus on Flying,
                <br />
                <span className="bg-gradient-to-r from-[#47C6D6] to-[#5588ED] bg-clip-text text-transparent">
                  Not Finances
                </span>
              </h3>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mb-8">
                Flexible financing lets you start training today with affordable monthly payments.
                No upfront burden — just a clear path from student pilot to the flight deck.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="https://apply.stratus.finance/" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#47C6D6] hover:bg-[#5DD6E4] text-[#101424] font-semibold px-7 py-3 text-sm rounded-xl shadow-lg shadow-[#47C6D6]/25 hover:shadow-[#47C6D6]/30 transition-all duration-200 cursor-pointer">
                    Apply for Financing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 gap-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Beyond Your FICO Score',
                  desc: 'Stratus looks at more than just credit — your earning potential matters.',
                  color: 'text-[#47C6D6]',
                  bg: 'bg-[#47C6D6]/10 border-[#47C6D6]/20',
                },
                {
                  icon: Clock,
                  title: 'Deferred Payments',
                  desc: '12-month deferment while you complete training and find employment.',
                  color: 'text-[#5588ED]',
                  bg: 'bg-[#5588ED]/10 border-[#5588ED]/20',
                },
                {
                  icon: Sparkles,
                  title: 'Full Program Financing',
                  desc: 'Cover your entire flight training from private through commercial.',
                  color: 'text-[#FFBC7D]',
                  bg: 'bg-[#FFBC7D]/10 border-[#FFBC7D]/20',
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

        <div className="mt-6 text-center">
          <Link
            href="/financing"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:font-bold hover:underline underline-offset-4 transition-all duration-200"
          >
            Explore other financing options
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
