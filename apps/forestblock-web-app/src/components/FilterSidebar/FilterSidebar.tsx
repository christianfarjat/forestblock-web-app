import React from "react";
import { FilterSidebarProps } from "./types";
import useMarketplaceFilters from "@/hooks/useMarketplaceFilters";
import FilterSection from "./FilterSection";
import CountryFilter from "./filters/CountryFilter";
import CategoryFilter from "./filters/CategoryFilter";
import VintageFilter from "./filters/VintageFilter";
import UNSDGFilter from "./filters/UNSDGFilter";

export default function FilterSidebar({
  countries,
  selectedCountries,
  onFilterChange,
  categories,
  selectedCategories,
  onCategoryChange,
  vintages,
  selectedVintages,
  onVintageChange,
  unsdgList,
  selectedUNSDG,
  onUNSDGChange,
  isMobileFiltersOpen,
  onCloseMobileFilters,
}: FilterSidebarProps) {
  const {
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
  } = useMarketplaceFilters({
    selectedCountries,
    onFilterChange,
    selectedCategories,
    onCategoryChange,
    selectedVintages,
    onVintageChange,
    selectedUNSDG,
    onUNSDGChange,
  });

  const hasActiveFilters =
    selectedCountries.length > 0 ||
    selectedCategories.length > 0 ||
    selectedVintages.length > 0 ||
    selectedUNSDG.length > 0;

  const clearFiltersAndCloseModal = () => {
    clearFilters();
    onCloseMobileFilters();
  };

  return (
    <>
      <div className="hidden lg:block absolute md:sticky top-0">
        <div className="bg-white text-gray-800 flex flex-col gap-5 w-full lg:w-auto p-5 rounded-2xl">
          <h2 className="text-[20px] font-neueMontreal font-medium text-forestGreen">
            Filtrar por:
          </h2>
          <FilterSection
            title="País"
            isExpanded={isCountriesExpanded}
            onToggle={() => setCountriesExpanded(!isCountriesExpanded)}
          >
            <CountryFilter
              countries={countries}
              selectedCountries={selectedCountries}
              toggleCountry={toggleCountry}
            />
          </FilterSection>

          <FilterSection
            title="Categoría"
            isExpanded={isCategoriesExpanded}
            onToggle={() => setCategoriesExpanded(!isCategoriesExpanded)}
          >
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          </FilterSection>

          <FilterSection
            title="Antiguedad"
            isExpanded={isVintagesExpanded}
            onToggle={() => setVintagesExpanded(!isVintagesExpanded)}
          >
            <VintageFilter
              vintages={vintages}
              selectedVintages={selectedVintages}
              toggleVintage={toggleVintage}
            />
          </FilterSection>

          <FilterSection
            title="ODS"
            isExpanded={isUNSDGExpanded}
            onToggle={() => setUNSDGExpanded(!isUNSDGExpanded)}
          >
            <UNSDGFilter
              unsdgList={unsdgList}
              selectedUNSDG={selectedUNSDG}
              toggleUNSDG={toggleUNSDG}
            />
          </FilterSection>

          {hasActiveFilters && (
            <button
              className="py-2 px-4 rounded bg-mintGreen hover:bg-opacity-80 text-forestGreen text-sm font-medium"
              onClick={clearFilters}
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-neueMontreal font-medium text-forestGreen">
              Filtrar por:
            </h2>
            <button
              onClick={onCloseMobileFilters}
              className="text-2xl font-bold text-gray-800"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <FilterSection
              title="País"
              isExpanded={isCountriesExpanded}
              onToggle={() => setCountriesExpanded(!isCountriesExpanded)}
            >
              <CountryFilter
                countries={countries}
                selectedCountries={selectedCountries}
                toggleCountry={toggleCountry}
              />
            </FilterSection>

            <FilterSection
              title="Categoría"
              isExpanded={isCategoriesExpanded}
              onToggle={() => setCategoriesExpanded(!isCategoriesExpanded)}
            >
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
              />
            </FilterSection>

            <FilterSection
              title="Antiguedad"
              isExpanded={isVintagesExpanded}
              onToggle={() => setVintagesExpanded(!isVintagesExpanded)}
            >
              <VintageFilter
                vintages={vintages}
                selectedVintages={selectedVintages}
                toggleVintage={toggleVintage}
              />
            </FilterSection>

            <FilterSection
              title="ODS"
              isExpanded={isUNSDGExpanded}
              onToggle={() => setUNSDGExpanded(!isUNSDGExpanded)}
            >
              <UNSDGFilter
                unsdgList={unsdgList}
                selectedUNSDG={selectedUNSDG}
                toggleUNSDG={toggleUNSDG}
              />
            </FilterSection>

            {hasActiveFilters && (
              <button
                className="py-1 px-3 rounded bg-mintGreen hover:bg-opacity-80 text-forestGreen text-xs font-medium"
                onClick={clearFiltersAndCloseModal}
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
