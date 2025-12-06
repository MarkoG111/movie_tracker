import React, { createContext, useContext, useState, ReactNode } from "react";
import { Movie } from "../types/Movie";

import toWatchIds from "../data/toWatch.json";
import watchedIds from "../data/watched.json";
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
  // Convert IMDb IDs -> minimal Movie objects
  const createMovie = (imdbId: string, status: Movie["status"]): Movie => ({
    imdbId,
    title: `Loading… (${imdbId})`,
    year: 0,
    runtime: 0,
    poster: "",
    genres: [],
    rating: 0,
    status,
  });

  const [toWatchMovies, setToWatchMovies] = useState<Movie[]>(
    toWatchIds.map((id) => createMovie(id, "toWatch"))
  );

  const [watchedMovies, setWatchedMovies] = useState<Movie[]>(
    watchedIds.map((id) => createMovie(id, "watched"))
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
