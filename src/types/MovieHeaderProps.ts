export interface MovieHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;

  showFilters: boolean;
  setShowFilters: (value: boolean) => void;

  selectedGenre: string;
  setSelectedGenre: (value: string) => void;

  // Fix: use literal union type instead of string
  sortBy: "title" | "year" | "rating";
  setSortBy: (value: "title" | "year" | "rating") => void;

  allGenres: string[];

  toWatchCount: number;
  watchedCount: number;
}
