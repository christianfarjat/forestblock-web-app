import { UNSDGFilterProps } from "./types";

export default function UNSDGFilter({
  unsdgList,
  selectedUNSDG,
  toggleUNSDG,
}: UNSDGFilterProps) {
  return (
    <>
      {unsdgList.map((sdg) => (
        <label key={sdg.id} className="flex items-center text-sm gap-3">
          <input
            type="checkbox"
            checked={selectedUNSDG.includes(sdg.id.toString())}
            onChange={() => toggleUNSDG(sdg.id.toString())}
            className="transform scale-125"
          />
          {sdg.name}
        </label>
      ))}
    </>
  );
}
