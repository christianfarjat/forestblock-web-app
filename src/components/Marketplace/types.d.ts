import { Project } from "@/types/project";

export interface HeaderSectionProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export interface ProjectListProps {
  loading: boolean;
  projects: Project[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}
