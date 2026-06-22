"use client";

import Image from "next/image";
import { useGallery } from "@/hooks/useGallery";
import { GalleryProps } from "./types";
import Thumbnail from "./Thumbnail";
import MapView from "./MapView";

const Gallery = ({ images, location }: GalleryProps) => {
  const {
    currentImageIndex,
    coordinates,
    customIcon,
    handleNext,
    handlePrev,
    isMap,
    setCurrentImageIndex,
  } = useGallery({ images, location });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Imagen principal o mapa */}
      <div className="relative w-full max-w-4xl h-[300px] lg:h-[450px] flex justify-center items-center bg-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-3 w-10 h-10 rounded-full hover:bg-opacity-75 focus:outline-none flex items-center justify-center"
        >
          &#10094;
        </button>
        {isMap ? (
          <div className="w-full h-full">
            <MapView coordinates={coordinates} customIcon={customIcon} />
          </div>
        ) : (
          <Image
            fill
            src={images[currentImageIndex - 1].url}
            alt={
              images[currentImageIndex - 1].caption ||
              `Image ${currentImageIndex}`
            }
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}

        <button
          onClick={handleNext}
          className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-3 w-10 h-10 rounded-full hover:bg-opacity-75 focus:outline-none flex items-center justify-center"
        >
          &#10095;
        </button>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto w-full max-w-4xl">
        <Thumbnail
          onClick={() => setCurrentImageIndex(0)}
          isSelected={isMap}
          coordinates={coordinates}
          customIcon={customIcon}
        />
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            onClick={() => setCurrentImageIndex(index + 1)}
            isSelected={index + 1 === currentImageIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
