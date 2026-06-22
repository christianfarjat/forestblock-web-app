import { useState } from "react";

function useMarketplaceFilters({
  selectedCountries,
  onFilterChange,
  selectedCategories,
  onCategoryChange,
  selectedVintages,
  onVintageChange,
  selectedUNSDG,
  onUNSDGChange,
}: {
  selectedCountries: string[];
  onFilterChange: (selectedCountries: string[]) => void;
  selectedCategories: string[];
  onCategoryChange: (selectedCategories: string[]) => void;
  selectedVintages: string[];
  onVintageChange: (selectedVintages: string[]) => void;
  selectedUNSDG: string[];
  onUNSDGChange: (selectedUNSDG: string[]) => void;
}) {
  const [isCountriesExpanded, setCountriesExpanded] = useState(false);
  const [isCategoriesExpanded, setCategoriesExpanded] = useState(false);
  const [isVintagesExpanded, setVintagesExpanded] = useState(false);
  const [isUNSDGExpanded, setUNSDGExpanded] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const onCloseMobileFilters = () => {
    setMobileFiltersOpen(false);
  };

  const toggleCountry = (country: string) => {
    const updatedSelectedCountries = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];
    onFilterChange(updatedSelectedCountries);
  };

  const toggleCategory = (category: string) => {
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(updatedSelectedCategories);
  };

  const toggleVintage = (vintage: string) => {
    const updatedSelectedVintages = selectedVintages.includes(vintage)
      ? selectedVintages.filter((v) => v !== vintage)
      : [...selectedVintages, vintage];
    onVintageChange(updatedSelectedVintages);
  };

  const toggleUNSDG = (id: string) => {
    const updatedSelectedUNSDG = selectedUNSDG.includes(id)
      ? selectedUNSDG.filter((sdg) => sdg !== id)
      : [...selectedUNSDG, id];
    onUNSDGChange(updatedSelectedUNSDG);
  };

  const clearFilters = () => {
    onFilterChange([]);
    onCategoryChange([]);
    onVintageChange([]);
    onUNSDGChange([]);
    setCountriesExpanded(false);
    setCategoriesExpanded(false);
    setVintagesExpanded(false);
    setUNSDGExpanded(false);
    onCloseMobileFilters();
  };

  return {
    isCountriesExpanded,
    setCountriesExpanded,
    isCategoriesExpanded,
    setCategoriesExpanded,
    isVintagesExpanded,
    setVintagesExpanded,
    isUNSDGExpanded,
    setUNSDGExpanded,
    toggleCountry,
    toggleCategory,
    toggleVintage,
    toggleUNSDG,
    clearFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    onCloseMobileFilters,
  };
}

export default useMarketplaceFilters;
