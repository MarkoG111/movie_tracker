import { useMoviesContext } from "../context/MoviesContext";

export function useMovies() {
    const { movies, moveToWatched, moveToToWatch, removeMovie } =
        useMoviesContext();

    const toWatchMovies = movies.filter((m) => m.status === "toWatch");
    const watchedMovies = movies.filter((m) => m.status === "watched");

    return {
        movies,
        toWatchMovies,
        watchedMovies,
        moveToToWatch,
        moveToWatched,
        removeMovie,
    };
}
