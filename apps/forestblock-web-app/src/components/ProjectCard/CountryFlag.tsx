import Image from "next/image";

const countryCodes: Record<string, string> = {
  China: "cn",
  India: "in",
  "Korea, Republic of": "kr",
  "South Korea": "kr",
  Peru: "pe",
  Congo: "cg",
  "Congo, The Democratic Republic of the": "cd",
  Ukraine: "ua",
  Colombia: "co",
  Myanmar: "mm",
  Italy: "it",
  Brazil: "br",
  Belize: "bz",
  Bolivia: "bo",
  "Bolivia, Plurinational State of": "bo",
  Bulgaria: "bg",
  Cambodia: "kh",
  Canada: "ca",
  Chile: "cl",
  Indonesia: "id",
  Kenya: "ke",
  Pakistan: "pk",
  Turkey: "tr",
  Türkiye: "tr",
  Uganda: "ug",
  "Viet Nam": "vn",
};

function CountryFlag({ country }: { country?: string }) {
  const normalizedCountry = country?.trim();
  const countryCode = normalizedCountry
    ? countryCodes[normalizedCountry]
    : undefined;

  if (!countryCode) {
    console.warn(`No country code found for: ${country}`);
  }

  return (
    <Image
      src={`https://flagcdn.com/w40/${countryCode || "unknown"}.png`}
      alt={country || "Unknown Country"}
      width={25}
      height={25}
      style={{ width: "auto", height: "auto" }}
    />
  );
}

export default CountryFlag;
