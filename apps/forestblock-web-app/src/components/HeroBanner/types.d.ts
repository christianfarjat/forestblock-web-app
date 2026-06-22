export interface HeroBannerProps {
  title: React.ReactNode;
  children: React.ReactNode;
  showSearchbar?: boolean;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}
