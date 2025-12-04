import { useEffect, useState } from "react";
import { getMovieDetails } from "../api/tmdb";

const CACHE_KEY = "movieDetailsCache";

function loadCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveCache(cache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function useMovieDetails(imdbId) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (!imdbId) return;

        const cache = loadCache();

        if (cache[imdbId]) {
            setDetails(cache[imdbId]);
            return;
        }

        getMovieDetails(imdbId).then(data => {
            const formatted = {
                imdbId,
                title: data.title,
                year: data.release_date?.slice(0, 4),
                poster: data.poster_path
                    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                    : "https://image.tmdb.org/t/p/w300_and_h450_bestv2/none.jpg",
                genres: data.genres?.map(g => g.name) ?? [],
                runtime: data.runtime,
                rating: data.vote_average.toFixed(1),
            };

            cache[imdbId] = formatted;
            saveCache(cache);

            setDetails(formatted);
        });
    }, [imdbId]);

    return details;
}
