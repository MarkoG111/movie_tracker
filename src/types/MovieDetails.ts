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
    cast?: string[]; // actor names

    // Gallery
    images?: string[]; // image URLs

    // Extras
    videos?: MovieVideo[];
    reviews?: MovieReview[];
}

export interface MovieVideo {
    key: string; // YouTube key, etc.
    name: string;
    site: string; // "YouTube"
    type: string; // "Trailer", "Teaser", etc.
}

export interface MovieReview {
    author: string;
    content: string;
    url: string;
}
