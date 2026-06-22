import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Image from "next/image";

const Thumbnail = ({
  image,
  isSelected,
  onClick,
  coordinates,
  customIcon,
}: {
  image?: { url: string; caption?: string };
  isSelected: boolean;
  onClick: () => void;
  coordinates?: [number, number];
  customIcon?: L.Icon;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-[calc(22%-0.5rem)] h-[70px] lg:h-[90px] rounded-lg cursor-pointer border-2 ${
        isSelected ? "border-blue-500 shadow-lg" : "border-transparent"
      }`}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.caption || "Thumbnail"}
          width={110}
          height={110}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <MapContainer
          center={coordinates}
          zoom={1}
          className="w-full h-full rounded-lg pointer-events-none"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {coordinates && <Marker position={coordinates} icon={customIcon} />}
        </MapContainer>
      )}
    </div>
  );
};

export default Thumbnail;
