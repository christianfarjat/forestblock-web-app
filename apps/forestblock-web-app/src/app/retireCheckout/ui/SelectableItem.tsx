import Image from "next/image";
import { SelectableItemProps } from "../types";

const SelectableItem: React.FC<SelectableItemProps> = ({
  title,
  logoSrc,
  label,
  description,
  isLast = false,
}) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4 relative">
      <div className="w-6 h-6 rounded-full border-2 border-customGreen bg-white flex items-center justify-center relative z-10">
        <div className="w-4 h-4 bg-customGreen rounded-full"></div>
      </div>
      {!isLast && (
        <div className="flex-1 w-0.5 bg-customGreen absolute h-[130px]" />
      )}
    </div>

    <div className="flex-1">
      <p className="font-aeonik font-medium text-forestGreen text-[23px]">
        {title}
      </p>
      <div className="flex items-center gap-2 border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Image src={logoSrc} alt={label} width={20} height={20} />
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-gray-500 text-sm">{description}</span>
      </div>
    </div>
  </div>
);

export default SelectableItem;
