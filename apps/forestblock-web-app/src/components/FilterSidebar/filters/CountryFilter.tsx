import { CountryFilterProps } from "../types";

export default function CountryFilter({
  countries,
  selectedCountries,
  toggleCountry,
}: CountryFilterProps) {
  return (
    <>
      {countries.sort().map((country) => (
        <label key={country} className="flex items-center text-sm gap-3">
          <input
            type="checkbox"
            checked={selectedCountries.includes(country)}
            onChange={() => toggleCountry(country)}
            className="transform scale-125"
          />
          {country}
        </label>
      ))}
    </>
  );
}
