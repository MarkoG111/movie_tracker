import { Movie } from "../types/Movie";
import { useMemo } from "react";

interface FilterOptions {
    searchQuery: string;
    selectedGenre: string;
    sortBy: "title" | "year" | "rating";
}

export function useFilteredMovies(
    movies: Movie[],
    { searchQuery, selectedGenre, sortBy }: FilterOptions
) {
    return useMemo(() => {
        let filtered = [...movies];

        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((m) =>
                m.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedGenre !== "all") {
            filtered = filtered.filter((m) =>
                m.genres
                    .map((g) => g.toLowerCase())
                    .includes(selectedGenre.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "year":
                    return b.year - a.year;
                case "rating":
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [movies, searchQuery, selectedGenre, sortBy]);
}
