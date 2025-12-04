import { useState, useRef, useCallback } from "react";
import { getToWatchIds, getWatchedIds } from "../services/moviesService";
import { getMovieDetails } from "../api/tmdb";

const BATCH_SIZE = 18;

// Globalni cache
const transformedMoviesCache = new Map();

export function useMovies(type) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const loadingRef = useRef(false);
    const baseIds = type === "watched" ? getWatchedIds() : getToWatchIds();

    const transformMovie = (data, type) => ({
        id: data.id,
        title: data.title,
        year: data.release_date ? new Date(data.release_date).getFullYear() : 0,
        rating: data.vote_average.toFixed(1) || 0,
        runtime: data.runtime || 0,
        genres: data.genres ? data.genres.map(g => g.name) : [],
        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        status: type
    });

    const loadMovie = async (id) => {
        const cacheKey = `${type}-${id}`;
        if (transformedMoviesCache.has(cacheKey)) {
            return transformedMoviesCache.get(cacheKey);
        }

        try {
            const data = await getMovieDetails(id);
            const transformed = transformMovie(data, type);
            transformedMoviesCache.set(cacheKey, transformed);
            return transformed;
        } catch (err) {
            console.warn(`Skipping invalid movie ID: ${id}`, err.message);
            return null;
        }
    };

    const sortMovies = (moviesArray, sortBy) => {
        const sorted = [...moviesArray];
        if (sortBy === 'title') return sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === 'year') return sorted.sort((a, b) => b.year - a.year);
        if (sortBy === 'rating') return sorted.sort((a, b) => b.rating - a.rating);
        return sorted;
    };

    const applyFilters = useCallback(async (searchQuery, selectedGenre, sortBy) => {
        setLoading(true);
        setMovies([]);
        setCurrentPage(0);
        loadingRef.current = true;

        try {
            // Učitaj sve filmove odjednom
            const allMovies = await Promise.allSettled(
                baseIds.map(id => loadMovie(id))
            );

            const loadedMovies = allMovies
                .map(result => result.status === 'fulfilled' ? result.value : null)
                .filter(movie => movie !== null);

            // Primeni filtere
            let filtered = loadedMovies;

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                filtered = filtered.filter(m =>
                    m.title.toLowerCase().includes(searchLower)
                );
            }

            if (selectedGenre !== 'all') {
                filtered = filtered.filter(m =>
                    m.genres && m.genres.includes(selectedGenre)
                );
            }

            // Sortiraj sve
            filtered = sortMovies(filtered, sortBy);

            // Sačuvaj sve filtrirane filmove
            setFilteredMovies(filtered);

            // Prikazi prvi batch
            const firstBatch = filtered.slice(0, BATCH_SIZE);
            setMovies(firstBatch);
            setCurrentPage(1);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [baseIds, type]);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || currentPage * BATCH_SIZE >= filteredMovies.length) return;

        loadingRef.current = true;
        setLoadingMore(true);

        try {
            const nextPage = currentPage + 1;
            const nextBatch = filteredMovies.slice(0, nextPage * BATCH_SIZE);
            setMovies(nextBatch);
            setCurrentPage(nextPage);
        } catch (err) {
            setError(err.message);
        } finally {
            loadingRef.current = false;
            setLoadingMore(false);
        }
    }, [currentPage, filteredMovies]);

    const hasMore = currentPage * BATCH_SIZE < filteredMovies.length;

    return {
        movies,
        loading,
        loadingMore,
        error,
        loadMore,
        hasMore,
        applyFilters,
        totalMovies: filteredMovies.length,
        loadedMovies: movies.length
    };
}