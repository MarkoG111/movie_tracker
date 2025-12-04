import { useState, useEffect, useCallback } from "react";
import {
    loadMovies,
    addMovie as serviceAddMovie,
    updateMovieStatus as serviceUpdateMovieStatus,
    removeMovie as serviceRemoveMovie,
} from "../services/moviesService";

export function useMovies() {
    const [movies, setMovies] = useState([]);

    // Učitaj sve filmove na mount
    useEffect(() => {
        setMovies(loadMovies());
    }, []);

    const addMovie = useCallback((imdbId, status = "toWatch") => {
        const updated = serviceAddMovie(imdbId, status);
        setMovies([...updated]);
    }, []);

    const moveToWatched = useCallback((imdbId) => {
        const updated = serviceUpdateMovieStatus(imdbId, "watched");
        setMovies([...updated]);
    }, []);

    const moveToWatch = useCallback((imdbId) => {
        const updated = serviceUpdateMovieStatus(imdbId, "toWatch");
        setMovies([...updated]);
    }, []);

    const removeMovie = useCallback((imdbId) => {
        const updated = serviceRemoveMovie(imdbId);
        setMovies([...updated]);
    }, []);

    // Selektori
    const toWatchMovies = movies.filter(m => m.status === "toWatch");
    const watchedMovies = movies.filter(m => m.status === "watched");

    return {
        movies,
        toWatchMovies,
        watchedMovies,
        addMovie,
        moveToWatched,
        moveToWatch,
        removeMovie,
    };
}
