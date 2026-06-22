export default function SortDropdown({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: (value: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2 bg-white p-3 rounded-full">
      <span className="text-filtersGray font-neueMontreal">Ordenar por:</span>
      <select
        className="bg-transparent text-filtersGray text-sm focus:outline-none font-neueMontreal"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="price-desc">Precio más alto</option>
        <option value="price-asc">Precio más bajo</option>
        <option value="recently-update ">Recientemente actualizado</option>
        <option value="newest">Lo más nuevo</option>
        <option value="oldest">Lo más antiguo</option>
        <option value="name">Nombre</option>
      </select>
    </div>
  );
}
