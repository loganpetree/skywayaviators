import { Camera, Grid3X3, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface GalleryImage {
  src: string;
  alt: string;
  isPlaceholder: boolean;
}

interface GalleryGridProps {
  galleryImages: GalleryImage[];
  instructor: string;
  handleShowAllPhotos: () => void;
  loading?: boolean;
  aircraftImages?: {
    original: string;
    large: string;
    medium: string;
    small: string;
  }[]; // Full aircraft images with all sizes
}

// Complete Gallery Implementation (Mobile + Desktop)
const GalleryGrid = ({ galleryImages, instructor, handleShowAllPhotos, loading = false, aircraftImages = [] }: GalleryGridProps) => {
  const [fullScreenImage, setFullScreenImage] = useState<{
    images: {
      original: string;
      large: string;
      medium: string;
      small: string;
    }[];
    currentIndex: number;
  } | null>(null);

  const handleImageClick = (imageIndex: number) => {
    if (aircraftImages && aircraftImages.length > 0) {
      setFullScreenImage({
        images: aircraftImages,
        currentIndex: imageIndex
      });
    }
  };

  const handlePrevImage = () => {
    if (fullScreenImage) {
      setFullScreenImage({
        ...fullScreenImage,
        currentIndex: fullScreenImage.currentIndex > 0 ? fullScreenImage.currentIndex - 1 : fullScreenImage.images.length - 1
      });
    }
  };

  const handleNextImage = () => {
    if (fullScreenImage) {
      setFullScreenImage({
        ...fullScreenImage,
        currentIndex: fullScreenImage.currentIndex < fullScreenImage.images.length - 1 ? fullScreenImage.currentIndex + 1 : 0
      });
    }
  };

  const handleCloseFullScreen = () => {
    setFullScreenImage(null);
  };


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!fullScreenImage) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextImage();
          break;
        case 'Escape':
          event.preventDefault();
          handleCloseFullScreen();
          break;
      }
    };

    if (fullScreenImage) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [fullScreenImage]);
  return (
    <div id="media" className="relative">
      {/* Mobile: Single image */}
      <div className="lg:hidden px-4 py-6">
        <div className="relative h-80 sm:h-96 max-w-sm mx-auto">
          {loading ? (
            // Loading placeholder
            <div className="w-full h-full bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Loading...</p>
              </div>
            </div>
          ) : galleryImages[0] ? (
            galleryImages[0].isPlaceholder ? (
              <Image
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                width={640}
                height={320}
                className="w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(0)}
              />
            ) : (
              // Use regular img tag for base64 images
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                className="w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(0)}
              />
            )
          ) : (
            // Fallback placeholder
            <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No image available</p>
              </div>
            </div>
          )}
          {galleryImages[0] && galleryImages[0].isPlaceholder && !loading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-2xl">
              <div className="text-center text-gray-400">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Instructor Photo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Gallery grid */}
      <div className="hidden lg:block">
        <div className="w-full px-4 sm:px-6">
          <div className="relative flex gap-2 h-[28rem] overflow-hidden rounded-xl my-6">
            {/* Main large photo - left side (square) */}
            <div className="h-[28rem] w-[28rem] relative rounded-l-xl overflow-hidden flex-shrink-0">
              {loading ? (
                // Loading placeholder for main image
                <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center rounded-l-xl">
                  <div className="text-center text-gray-400">
                    <Camera className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-medium">Loading...</p>
                  </div>
                </div>
              ) : galleryImages[0] ? (
                galleryImages[0].isPlaceholder ? (
                  <Image
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(0)}
                  />
                ) : (
                  // Use regular img tag for base64 images
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(0)}
                  />
                )
              ) : (
                // Fallback placeholder
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-l-xl">
                  <div className="text-center text-gray-400">
                    <Camera className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-medium">No image</p>
                  </div>
                </div>
              )}
              {galleryImages[0] && galleryImages[0].isPlaceholder && !loading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Camera className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-medium">Instructor Photo</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - 2x2 grid (fills remaining space) */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 h-[28rem]">
              {loading ? (
                // Loading placeholders for grid
                Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className={`relative h-full bg-gray-200 animate-pulse flex items-center justify-center ${index === 1 || index === 3 ? 'rounded-r-xl' : ''}`}>
                    <div className="text-center text-gray-400">
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">Loading...</p>
                    </div>
                  </div>
                ))
              ) : (
                // Actual images
                Array.from({ length: 4 }, (_, index) => {
                  const image = galleryImages[index + 1];
                  return (
                    <div key={index} className={`relative h-full ${index === 1 || index === 3 ? 'rounded-r-xl overflow-hidden' : ''}`}>
                      {image ? (
                        image.isPlaceholder ? (
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={320}
                            height={196}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(index + 1)}
                          />
                        ) : (
                          // Use regular img tag for base64 images
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(index + 1)}
                          />
                        )
                      ) : (
                        // Fallback placeholder for missing images
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Camera className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-xs">No image</p>
                          </div>
                        </div>
                      )}
                      {image && image.isPlaceholder && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Camera className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-xs">{image.alt}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Show all photos button */}
            <Button
              variant="outline"
              className="absolute bottom-4 right-4 bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-md z-10"
              onClick={handleShowAllPhotos}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Show all photos
            </Button>
          </div>
        </div>
      </div>

      {/* Full Screen Slideshow */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={handleCloseFullScreen}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseFullScreen}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 z-60"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white bg-black/50 rounded-full px-2 py-1 sm:px-3 sm:text-sm text-xs z-60">
            {fullScreenImage.currentIndex + 1} / {fullScreenImage.images.length}
          </div>

          {/* Previous Button */}
          {fullScreenImage.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 sm:p-3 z-60"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Next Button */}
          {fullScreenImage.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 sm:p-3 z-60"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Main Content */}
          <div className="flex flex-col items-center w-full px-2 sm:px-4" onClick={(e) => e.stopPropagation()}>
            {/* Main Image */}
            <div className="w-full flex items-center justify-center mb-2 sm:mb-4">
              <img
                src={fullScreenImage.images[fullScreenImage.currentIndex]?.original ||
                     fullScreenImage.images[fullScreenImage.currentIndex]?.large ||
                     fullScreenImage.images[fullScreenImage.currentIndex]?.medium ||
                     fullScreenImage.images[fullScreenImage.currentIndex]?.small}
                alt={`${instructor} - Image ${fullScreenImage.currentIndex + 1}`}
                className="max-h-[60vh] sm:max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Thumbnail Strip */}
            {fullScreenImage.images.length > 1 && (
              <div className="flex justify-center px-2 py-2 sm:px-4 sm:py-2">
                <div className="bg-black/60 rounded-lg px-3 py-3 sm:px-4 sm:py-4 max-w-5xl">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto justify-center">
                    {fullScreenImage.images.map((image, index: number) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-md border-2 transition-all overflow-hidden ${
                          index === fullScreenImage.currentIndex
                            ? 'border-white shadow-lg bg-white/10'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullScreenImage({
                            ...fullScreenImage,
                            currentIndex: index
                          });
                        }}
                      >
                        <img
                          src={image.small || image.medium || image.large || image.original}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
