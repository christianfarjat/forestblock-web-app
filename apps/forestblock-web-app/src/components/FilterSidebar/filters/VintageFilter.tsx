import { VintageFilterProps } from "../types";

export default function VintageFilter({
  vintages,
  selectedVintages,
  toggleVintage,
}: VintageFilterProps) {
  return (
    <>
      {vintages.map((vintage) => (
        <label key={vintage} className="flex items-center text-sm gap-3">
          <input
            type="checkbox"
            checked={selectedVintages.includes(vintage)}
            onChange={() => toggleVintage(vintage)}
            className="transform scale-125"
          />
          {vintage}
        </label>
      ))}
    </>
  );
}
