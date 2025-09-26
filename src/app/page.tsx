'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { incrementPageLoadCount, trackPageView } from "@/lib/firebase";
import { useAircraftStore } from "@/stores/aircraftStore";
import { Program } from "@/types/program";
import { Package } from "@/types/package";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  HeroSection,
  ProgramsSection,
  FleetSection,
  TimeBuildingSection,
  TestimonialsSection,
  Footer
} from "@/components/home";

export default function Home() {
  const { aircraft, loading, error, fetchAircraft, fetched } = useAircraftStore();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const searchParams = useSearchParams();

  // Fetch aircraft data from store if not already fetched
  useEffect(() => {
    console.log('🏠 Main Page:', {
      aircraftCount: aircraft.length,
      loading,
      fetched,
      error
    })

    if (!fetched) {
      console.log('🔄 Main Page: Fetching aircraft...')
      fetchAircraft();
    }
  }, [fetched, fetchAircraft, aircraft.length, loading, error]);

  // Fetch programs from Firebase
  const fetchPrograms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "programs"));
      const programsData: Program[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        programsData.push({
          id: doc.id,
          ...data,
          name: data.name || '',
          description: data.description || '',
          features: data.features || [],
          images: data.images || [],
          price: data.price || ''
        } as Program);
      });
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setProgramsLoading(false);
    }
  };

  // Fetch packages from Firebase
  const fetchPackages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const packagesData: Package[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        packagesData.push({
          id: doc.id,
          ...data,
          name: data.name || '',
          description: data.description || '',
          features: data.features || [],
          images: data.images || [],
          price: data.price || '',
          duration: data.duration || '',
          category: data.category || ''
        } as Package);
      });
      setPackages(packagesData);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setPackagesLoading(false);
    }
  };

  // Fetch programs and packages on component mount
  useEffect(() => {
    fetchPrograms();
    fetchPackages();
  }, []);


  useEffect(() => {
    // Track page view with client-side analytics (API route seems to have issues)
    trackPageView('/', { pageType: 'home', source: 'direct' });

    // Keep legacy counter for backward compatibility
    incrementPageLoadCount();
  }, []);

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
  }, [searchParams, programsLoading, packagesLoading]); // Re-run when data loads




  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-transparent">
      <HeroSection />

      <ProgramsSection
        programs={programs}
        programsLoading={programsLoading}
      />

      <FleetSection
        aircraft={aircraft}
        loading={loading}
      />

      <TimeBuildingSection
        packages={packages}
        packagesLoading={packagesLoading}
      />

      <TestimonialsSection />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Your page content goes here */}
      </main>

      <Footer />
    </div>
  );
}
