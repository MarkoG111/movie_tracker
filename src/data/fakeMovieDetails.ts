import { MovieDetails } from "../types/MovieDetails";

export const getFakeMovieDetails = (id: string): MovieDetails | null => {
  return {
    imdbId: id,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    runtime: 142,
    genres: ["Drama"],
    overview: "Two imprisoned men bond over a number of years...",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    status: "watched",
    budget: 25000000,
    revenue: 58000000,
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman"],
    images: [],
  };
};
