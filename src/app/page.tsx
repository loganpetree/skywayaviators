import type { Metadata } from 'next';
import {
  HeroWithData,
  HomeClientEffects,
  ProgramsSection,
  FinancingSection,
  BookFlightSection,
  TestimonialsSection,
  FleetShowcase,
  FAQSection,
  LocationSection,
  Footer,
} from '@/components/home';
import ScrollToSection from '@/components/ScrollToSection';

const SITE_URL = 'https://skywayaviators.com';

export const metadata: Metadata = {
  title: 'Skyway Aviators — Flight Training & Aircraft Rental in Lancaster, TX',
  description:
    'Premier Part 61 flight school near Dallas, Texas. Private pilot through commercial certifications, time-building packages, Stratus financing, and a modern Cessna & Piper fleet at Lancaster Regional Airport (KLNC).',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Skyway Aviators — Flight Training & Aircraft Rental in Lancaster, TX',
    description:
      'Premier Part 61 flight school near Dallas. Private pilot through commercial certifications, time-building, and flexible financing at Lancaster Regional Airport.',
    url: SITE_URL,
    siteName: 'Skyway Aviators',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/skyway-logo.webp`,
        width: 512,
        height: 512,
        alt: 'Skyway Aviators logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyway Aviators — Flight Training in Lancaster, TX',
    description:
      'Part 61 certified flight school near Dallas. Discovery flights, PPL through CPL, time-building, and financing options.',
    images: [`${SITE_URL}/skyway-logo.webp`],
  },
  keywords: [
    'flight school Dallas TX',
    'flight training Lancaster Texas',
    'private pilot license Texas',
    'commercial pilot training DFW',
    'time building hours Texas',
    'aircraft rental Lancaster TX',
    'discovery flight near me',
    'Part 61 flight school',
    'Skyway Aviators',
    'KLNC flight training',
    'Stratus Financial flight loans',
    'learn to fly Dallas',
  ],
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'Skyway Aviators',
  description:
    'Premier Part 61 flight school offering private pilot through commercial certifications, time-building packages, and aircraft rental at Lancaster Regional Airport near Dallas, TX.',
  url: SITE_URL,
  telephone: '+1-469-928-4678',
  email: 'info@skywayaviators.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '730 Ferris Rd, Suite 102',
    addressLocality: 'Lancaster',
    addressRegion: 'TX',
    postalCode: '75146',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 32.5922,
    longitude: -96.7178,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '06:00',
    closes: '20:00',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '170',
    bestRating: '5',
    worstRating: '1',
  },
  image: `${SITE_URL}/skyway-logo.webp`,
  priceRange: '$$',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does it take to get a private pilot license?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most students complete their Private Pilot License in 3–6 months, depending on how often they fly. The FAA requires a minimum of 40 hours of flight time, but the national average is around 60–70 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need any experience before my first lesson?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "None at all. Our discovery flights are designed for complete beginners. Your instructor will walk you through everything, and you'll actually fly the airplane on your very first lesson.",
      },
    },
    {
      '@type': 'Question',
      name: 'What financing options are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We partner with Stratus Financial to offer flight training loans with deferred payments and flexible terms. We also accept pay-as-you-go and block-rate packages.',
      },
    },
    {
      '@type': 'Question',
      name: 'What aircraft will I train in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our fleet includes well-maintained Cessna and Piper aircraft equipped with modern avionics. Each airplane is suited for different stages of training, from your first lesson through instrument and commercial ratings.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I fly if I wear glasses or have a medical condition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most vision corrections are perfectly fine — you just need to meet FAA medical standards. Many conditions that seem disqualifying actually aren't. We recommend scheduling an FAA medical exam early so you know where you stand.",
      },
    },
    {
      '@type': 'Question',
      name: "What's the difference between Part 61 and Part 141 training?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Part 61 offers more scheduling flexibility and is great for students balancing work or school. Part 141 follows a structured, FAA-approved syllabus with potentially fewer required hours. We can help you decide which path fits your goals.',
      },
    },
  ],
};

const reviewJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Skyway Aviators',
  url: SITE_URL,
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Austin Liu' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody:
        "I built around 500 hours as a time builder with Skyway Aviators, and as a First Officer at Republic Airways, I can confidently say I couldn't have achieved that without them.",
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Chriss Handlly' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody:
        'Great flight school project, fairly easy to get scheduled. Planes are kept in great shape and the on-site mechanics were quick to respond.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Frankie Arreguin' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody:
        'My son flew 100 hours in a month. The good thing is that they have their mechanic in the field and he took care of it immediately.',
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-transparent">
        <HomeClientEffects />
        <ScrollToSection />
        <HeroWithData />

        <ProgramsSection />

        <FinancingSection />

        <BookFlightSection />

        <TestimonialsSection />

        <FleetShowcase />

        <FAQSection />

        <LocationSection />

        <Footer />
      </div>
    </>
  );
}
