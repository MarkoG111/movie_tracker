export interface MovieDetails {
  imdbId: string;

  // Basic info
  title: string;
  year: number;
  rating: number; 
  runtime: number;

  // Media
  poster: string;
  backdrop?: string;

  // Extra info
  tagline?: string;
  overview?: string;

  // Categorization
  genres: string[];
  status: "toWatch" | "watched";

  // Money
  budget?: number | null;
  revenue?: number | null;

  // Credits
  director?: string | null;
  cast?: string[];

  // Gallery
  images?: string[];
}
