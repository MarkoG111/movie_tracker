import { ReactNode, useState, createContext, useContext } from "react";
import { MovieDetails } from "../types/MovieDetails";
import { fetchTMDBDetails, fetchTMDBId } from "../services/tmdbService";

interface TMDBContextType {
    getDetails: (imdbId: string) => Promise<MovieDetails | null>;
    imdbToTMDB: Record<string, number>;
    details: Record<number, MovieDetails>;
}

const TMDBContext = createContext<TMDBContextType | null>(null);

export function TMDBProvider({ children }: { children: ReactNode }) {
    // State 1: IMDb → TMDb ID mapping
    const [imdbToTMDB, setImdbToTMDB] = useState<Record<string, number>>({});
    // State 2: TMDb ID → Full movie details
    const [details, setDetails] = useState<Record<number, MovieDetails>>({});

    // Resolve IMDb → TMDB ID (cached)
    const resolveId = async (imdbId: string): Promise<number | null> => {
        // 1. Already cached? Return it!
        if (imdbToTMDB[imdbId]) {
            return imdbToTMDB[imdbId];
        }

        // 2. Not cached → fetch from API
        const tmdbId = await fetchTMDBId(imdbId);
        if (!tmdbId) {
            return null;
        }

        // 3. Save to cache
        setImdbToTMDB((prev) => ({ ...prev, [imdbId]: tmdbId }));
        return tmdbId;
    };

    // Fetch full TMDB movie details
    const getDetails = async (imdbId: string): Promise<MovieDetails | null> => {
        // Step 1: Get TMDb ID from IMDb
        const tmdbId = await resolveId(imdbId);
        if (!tmdbId) {
            return null;
        }

        // Step 2: Already have full details? Return from cache!
        if (details[tmdbId]) {
            return details[tmdbId];
        }

        // Step 3: Fetch full movie data
        const movie = await fetchTMDBDetails(tmdbId);
        if (!movie) {
            return null;
        }

        // Step 4: Cache it
        setDetails((prev) => ({ ...prev, [tmdbId]: movie }));
        return movie;
    };

    return (
        <TMDBContext.Provider value={{ getDetails, imdbToTMDB, details }}>
            {children}
        </TMDBContext.Provider>
    );
}

export function useTMDB() {
    const ctx = useContext(TMDBContext);

    if (!ctx) {
        throw new Error("useTMDB must be used within TMDBProvider");
    }

    return ctx;
}
