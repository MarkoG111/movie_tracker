import { createContext, useContext, useState, ReactNode } from "react";

import toWatchData from "../data/toWatchFull.json";
import watchedData from "../data/watchedFull.json";

import { MovieBase } from "../types/MovieBase";
import { Movie } from "../types/Movie";

interface MoviesProviderProps {
    children: ReactNode;
}

interface MoviesContextValue {
    movies: Movie[];
    toWatchMovies: Movie[];
    watchedMovies: Movie[];
    moveToWatched: (id: string) => void;
    moveToToWatch: (id: string) => void;
    removeMovie: (id: string) => void;
}

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

export function MoviesProvider({ children }: MoviesProviderProps) {
    const [toWatchMovies, setToWatchMovies] = useState<Movie[]>(
        toWatchData.map((m: MovieBase) => ({ ...m, status: "toWatch" }))
    );
    const [watchedMovies, setWatchedMovies] = useState<Movie[]>(
        watchedData.map((m: MovieBase) => ({ ...m, status: "watched" }))
    );

    const allMovies = [...toWatchMovies, ...watchedMovies];

    function moveToWatched(id: string) {
        const movie = toWatchMovies.find((m) => m.imdbId === id);
        if (!movie) return;

        setToWatchMovies((prev) => prev.filter((m) => m.imdbId !== id));
        setWatchedMovies((prev) => [...prev, { ...movie, status: "watched" }]);
    }

    function moveToToWatch(id: string) {
        const movie = watchedMovies.find((m) => m.imdbId === id);
        if (!movie) return;

        setWatchedMovies((prev) => prev.filter((m) => m.imdbId !== id));
        setToWatchMovies((prev) => [...prev, { ...movie, status: "toWatch" }]);
    }

    function removeMovie(id: string) {
        setToWatchMovies((prev) => prev.filter((m) => m.imdbId !== id));
        setWatchedMovies((prev) => prev.filter((m) => m.imdbId !== id));
    }

    return (
        <MoviesContext.Provider
            value={{
                movies: allMovies,
                toWatchMovies,
                watchedMovies,
                moveToToWatch,
                moveToWatched,
                removeMovie,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
}

export function useMoviesContext() {
    const ctx = useContext(MoviesContext);

    if (!ctx) {
        throw new Error("useMoviesContext must be used inside MoviesProvider");
    }

    return ctx;
}
