import { FilterSectionProps } from "./types";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

export default function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-borderGray">
      <div
        className="flex justify-between items-center cursor-pointer text-base py-4"
        onClick={onToggle}
      >
        <h3 className="text-customGray text-[20px] font-neueMontreal">
          {title}
        </h3>
        <span>
          {isExpanded ? (
            <IoIosArrowUp className="text-customGray" />
          ) : (
            <IoIosArrowDown className="text-customGray" />
          )}
        </span>
      </div>
      {isExpanded && (
        <div className="flex flex-col gap-3 py-4 px-2 max-h-60 w-full overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}
