import { CategoryFilterProps } from "../types";

export default function CategoryFilter({
  categories,
  selectedCategories,
  toggleCategory,
}: CategoryFilterProps) {
  if (categories.length === 0) {
    return <p>No hay categorías disponibles</p>;
  }

  return (
    <>
      {categories.sort().map((category) => (
        <label key={category} className="flex items-center text-sm gap-3">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => toggleCategory(category)}
            className="transform scale-125"
          />
          {category}
        </label>
      ))}
    </>
  );
}
