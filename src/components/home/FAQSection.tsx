'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How long does it take to get a private pilot license?',
    a: 'Most students complete their Private Pilot License in 3–6 months, depending on how often they fly. The FAA requires a minimum of 40 hours of flight time, but the national average is around 60–70 hours.',
  },
  {
    q: 'Do I need any experience before my first lesson?',
    a: "None at all. Our discovery flights are designed for complete beginners. Your instructor will walk you through everything, and you'll actually fly the airplane on your very first lesson.",
  },
  {
    q: 'What financing options are available?',
    a: 'We partner with Stratus Financial to offer flight training loans with deferred payments and flexible terms. We also accept pay-as-you-go and block-rate packages. Visit our financing page for more details.',
  },
  {
    q: 'What aircraft will I train in?',
    a: 'Our fleet includes well-maintained Cessna and Piper aircraft equipped with modern avionics. Each airplane is suited for different stages of training, from your first lesson through instrument and commercial ratings.',
  },
  {
    q: 'Can I fly if I wear glasses or have a medical condition?',
    a: "Most vision corrections are perfectly fine — you just need to meet FAA medical standards. Many conditions that seem disqualifying actually aren't. We recommend scheduling an FAA medical exam early so you know where you stand.",
  },
  {
    q: "What's the difference between Part 61 and Part 141 training?",
    a: 'Part 61 offers more scheduling flexibility and is great for students balancing work or school. Part 141 follows a structured, FAA-approved syllabus with potentially fewer required hours. We can help you decide which path fits your goals.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? 'border-sky-200 bg-white shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className={`text-sm font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-sky-500' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
