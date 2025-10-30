import { useState, useMemo } from "react";
import L from "leaflet";
import { Image as ProjectImage } from "@/types/project";
import { Location } from "@/types/location";

export const useGallery = ({
  images,
  location,
}: {
  images: ProjectImage[];
  location?: Location | null;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const coordinates: [number, number] = [
    location?.geometry?.coordinates[1] ?? 0,
    location?.geometry?.coordinates[0] ?? 0,
  ];

  const customIcon = useMemo(() => {
    return new L.Icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41],
    });
  }, []);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex + 1 < images.length + 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : images.length
    );
  };

  const isMap = currentImageIndex === 0;

  return {
    currentImageIndex,
    coordinates,
    customIcon,
    handleNext,
    handlePrev,
    isMap,
    setCurrentImageIndex,
  };
};
