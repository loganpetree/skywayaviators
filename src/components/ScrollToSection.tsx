'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ScrollToSectionContent() {
  const searchParams = useSearchParams();

  // Handle scrolling to sections when navigating from header
  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #programs, #fleet, etc.)
    const hash = window.location.hash.slice(1); // Remove the '#' character
    if (hash) {
      // Small delay to ensure sections are rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}

export default function ScrollToSection() {
  return (
    <Suspense fallback={null}>
      <ScrollToSectionContent />
    </Suspense>
  );
}
