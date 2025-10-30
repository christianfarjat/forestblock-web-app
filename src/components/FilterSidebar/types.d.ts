export type FilterSidebarProps = {
  countries: string[];
  selectedCountries: string[];
  onFilterChange: (selectedCountries: string[]) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (selectedCategories: string[]) => void;
  vintages: string[];
  selectedVintages: string[];
  onVintageChange: (selectedVintages: string[]) => void;
  unsdgList: { id: number; name: string }[];
  selectedUNSDG: string[];
  onUNSDGChange: (selectedUNSDG: string[]) => void;
  isMobileFiltersOpen: boolean;
  onCloseMobileFilters: () => void;
};

export type FilterSectionProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export type CountryFilterProps = {
  countries: string[];
  selectedCountries: string[];
  toggleCountry: (country: string) => void;
};

export type CategoryFilterProps = {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
};

export type VintageFilterProps = {
  vintages: string[];
  selectedVintages: string[];
  toggleVintage: (vintage: string) => void;
};

export type UNSDG = {
  id: number;
  name: string;
};
