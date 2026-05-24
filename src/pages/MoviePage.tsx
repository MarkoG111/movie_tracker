import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieHeader from "../components/movies/MovieHeader";
import MovieList from "../lists/MovieList";
import { useMovies } from "../hooks/useMovies";
import { useFilteredMovies } from "../hooks/useFilteredMovies";
import {
    clearListScrollRestore,
    computeVisibleCountForIndex,
    getListScrollRestore,
    saveListScrollRestore,
    type ListType,
    type SortBy,
} from "../utils/listScrollRestore";

interface MoviePageProps {
    type: ListType;
}

export default function MoviePage({ type }: MoviePageProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [restoreState] = useState(() => getListScrollRestore(type));
    const [listResetKey, setListResetKey] = useState(0);

    const {
        toWatchMovies,
        watchedMovies,
        moveToWatched,
        moveToToWatch,
        removeMovie,
    } = useMovies();

    const movies = type === "toWatch" ? toWatchMovies : watchedMovies;
    const toggle = type === "toWatch" ? moveToWatched : moveToToWatch;

    const [showFilters, setShowFilters] = useState(
        restoreState?.filters.showFilters ?? false
    );
    const [searchQuery, setSearchQuery] = useState(
        restoreState?.filters.searchQuery ?? ""
    );
    const [selectedGenre, setSelectedGenre] = useState(
        restoreState?.filters.selectedGenre ?? "all"
    );
    const [sortBy, setSortBy] = useState<SortBy>(
        restoreState?.filters.sortBy ?? "title"
    );

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

    const handleLogoReset = () => {
        setSearchQuery("");
        setSelectedGenre("all");
        setSortBy("title");
        setShowFilters(false);
        clearListScrollRestore();
        setListResetKey((key) => key + 1);
        window.scrollTo(0, 0);
        navigate("/toWatch");
    };

    const handleOpenDetails = (
        imdbId: string,
        index: number,
        currentVisibleCount: number
    ) => {
        saveListScrollRestore({
            listKey: type,
            pathname: location.pathname,
            scrollY: window.scrollY,
            visibleCount: Math.max(
                computeVisibleCountForIndex(index),
                currentVisibleCount
            ),
            movieImdbId: imdbId,
            filters: {
                searchQuery,
                selectedGenre,
                sortBy,
                showFilters,
            },
        });
    };

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
                onLogoClick={handleLogoReset}
            />

            <MovieList
                key={listResetKey}
                movies={filteredMovies}
                onToggleStatus={toggle}
                onRemove={removeMovie}
                onOpenDetails={handleOpenDetails}
                scrollRestore={
                    restoreState
                        ? {
                              scrollY: restoreState.scrollY,
                              visibleCount: restoreState.visibleCount,
                              movieImdbId: restoreState.movieImdbId,
                          }
                        : undefined
                }
                isFiltered={
                    searchQuery !== "" ||
                    selectedGenre !== "all" ||
                    filteredMovies.length !== movies.length
                }
            />
        </>
    );
}
