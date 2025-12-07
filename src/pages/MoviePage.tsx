import { useMemo, useState } from "react";
import MovieHeader from "../components/movies/MovieHeader";
import MovieList from "../lists/MovieList";
import { useMovies } from "../hooks/useMovies";
import { useFilteredMovies } from "../hooks/useFilteredMovies";

interface MoviePageProps {
    type: "toWatch" | "watched";
}

export default function MoviePage({ type }: MoviePageProps) {
    const {
        toWatchMovies,
        watchedMovies,
        moveToWatched,
        moveToToWatch,
        removeMovie,
    } = useMovies();

    // Decide what content this page should display
    const movies = type === "toWatch" ? toWatchMovies : watchedMovies;
    const toggle = type === "toWatch" ? moveToWatched : moveToToWatch;

    // Filter state (shared structure)
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [sortBy, setSortBy] = useState<"title" | "year" | "rating">("title");

    const allGenres = useMemo(() => {
        const genreSet = new Set<string>();
        genreSet.add("all");

        [...toWatchMovies, ...watchedMovies].forEach((movie) => {
            movie.genres.forEach((genre) => genreSet.add(genre));
        });

        return Array.from(genreSet).sort((a, b) =>
            a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b)
        );
    }, [toWatchMovies, watchedMovies]);

    const filteredMovies = useFilteredMovies(movies, {
        searchQuery,
        selectedGenre,
        sortBy,
    });

    return (
        <>
            <MovieHeader
                toWatchCount={toWatchMovies.length}
                watchedCount={watchedMovies.length}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortBy={sortBy}
                setSortBy={setSortBy}
                allGenres={allGenres}
            />

            <MovieList
                movies={filteredMovies}
                onToggleStatus={toggle}
                onRemove={removeMovie}
                isFiltered={
                    searchQuery !== "" ||
                    selectedGenre !== "all" ||
                    sortBy !== "title" ||
                    filteredMovies.length !== movies.length
                }
            />
        </>
    );
}
