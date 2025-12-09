import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

import { supabase } from "../lib/supabase";
import { useAuthContext } from "./AuthContext";
import { Movie } from "../types/Movie";

interface MoviesProviderProps {
    children: ReactNode;
}

interface MoviesContextValue {
    toWatchMovies: Movie[];
    watchedMovies: Movie[];
    allMovies: Movie[];
    addMovie: (imdbId: string, status: "watched" | "toWatch") => Promise<void>;

    moveToWatched: (imdbId: string) => Promise<void>;
    moveToToWatch: (imdbId: string) => Promise<void>;
    removeMovie: (imdbId: string) => Promise<void>;
}

const MoviesContext = createContext<MoviesContextValue | null>(null);

export function MoviesProvider({ children }: MoviesProviderProps) {
    const { user } = useAuthContext();

    const [movies, setMovies] = useState<Movie[]>([]);
    const userId = user?.id;

    async function loadMovies() {
        const pageSize = 1000;
        let from = 0;
        let allRows: any[] = [];

        while (true) {
            const { data, error } = await supabase
                .from("movies")
                .select(`imdb_id, status, details:movie_details(*)`)
                .eq("user_id", userId)
                .order("created_at", { ascending: true })
                .range(from, from + pageSize - 1);

            if (error) {
                console.error("Error loading movies:", error);
                break;
            }

            if (!data || data.length === 0) {
                break;
            }

            allRows.push(...data);

            if (data.length < pageSize) {
                break; // last page
            }

            from += pageSize;
        }

        // Map rows to Movie type
        const fullMovies = allRows.map((row) => {
            const d = row.details;

            return {
                imdbId: row.imdb_id,
                status: row.status,
                title: d?.title ?? "",
                year: d?.year ?? "",
                poster: d?.poster ?? null,
                genres: d?.genres ?? [],
                runtime: d?.runtime ?? null,
                rating: d?.rating ?? null,
            };
        });

        setMovies(fullMovies);
    }

    // Load user's movie list from Supabase
    useEffect(() => {
        if (!userId) {
            setMovies([]);
            return;
        }

        loadMovies();
    }, [userId]);

    // Add movie
    async function addMovie(imdbId: string, status: "watched" | "toWatch") {
        if (!userId) {
            return;
        }

        await supabase.from("movies").insert({
            user_id: userId,
            imdb_id: imdbId,
            status,
        });

        await loadMovies();
    }

    // Move to watched
    async function moveToWatched(imdbId: string) {
        if (!userId) {
            return;
        }

        await supabase
            .from("movies")
            .update({ status: "watched" })
            .eq("user_id", userId)
            .eq("imdb_id", imdbId);

        setMovies((prev) =>
            prev.map((m) =>
                m.imdbId === imdbId ? { ...m, status: "watched" } : m
            )
        );
    }

    // Move to toToWatch
    async function moveToToWatch(imdbId: string) {
        if (!userId) {
            return;
        }

        await supabase
            .from("movies")
            .update({ status: "toWatch" })
            .eq("user_id", userId)
            .eq("imdb_id", imdbId);

        setMovies((prev) =>
            prev.map((m) =>
                m.imdbId === imdbId ? { ...m, status: "toWatch" } : m
            )
        );
    }

    // Remove movie
    async function removeMovie(imdbId: string) {
        if (!userId) {
            return;
        }

        await supabase
            .from("movies")
            .delete()
            .eq("user_id", userId)
            .eq("imdb_id", imdbId);

        setMovies((prev) => prev.filter((m) => m.imdbId !== imdbId));
    }

    const toWatchMovies = movies.filter((m) => m.status === "toWatch");
    const watchedMovies = movies.filter((m) => m.status === "watched");

    return (
        <MoviesContext.Provider
            value={{
                allMovies: movies,
                toWatchMovies,
                watchedMovies,
                addMovie,
                moveToWatched,
                moveToToWatch,
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
