import { CiSearch } from "react-icons/ci";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="flex items-center w-full p-3 border border-gray-200 rounded-3xl shadow-md bg-white">
      <CiSearch className="text-gray-400 text-2xl mr-2 ml-2" />
      <input
        className="flex-1 text-base outline-none text-[20px] font-aeonik"
        type="text"
        placeholder="Buscar proyecto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
