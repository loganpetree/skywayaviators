"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

interface AircraftImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  loading?: boolean;
}

export const AircraftImageCarousel: React.FC<AircraftImageCarouselProps> = ({
  images,
  alt,
  className = "",
  loading = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className={`relative w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className={`relative w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-48 overflow-hidden ${className}`}>
      <Image
        src={images[currentImageIndex]}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
      />

      {/* Navigation arrows - only show if there are multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
            aria-label="Previous image"
          >
            <IconArrowNarrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
            aria-label="Next image"
          >
            <IconArrowNarrowRight className="h-4 w-4" />
          </button>

          {/* Image indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
