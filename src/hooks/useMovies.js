import { useState, useEffect, useCallback, useRef } from 'react';
import { getToWatchIds, getWatchedIds } from '../services/moviesService';
import { getMovieDetails } from '../api/tmdb';

const BATCH_SIZE = 18;

export function useMovies(type) {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadingRef = useRef(false);
    const hasLoadedInitialRef = useRef(false);

    const ids = type === "watched" ? getWatchedIds() : getToWatchIds();
    const total = ids.length;

    // Reset when type changes
    useEffect(() => {
        setMovies([]);
        setPage(0);
        setError(null);
        loadingRef.current = false;
        hasLoadedInitialRef.current = false;
    }, [type]);

    const loadMore = useCallback(async () => {
        // Prevent concurrent loads
        if (loadingRef.current) {
            console.log('Already loading, skipping...');
            return;
        }

        const currentIds = type === "watched" ? getWatchedIds() : getToWatchIds();
        const start = page * BATCH_SIZE;
        const end = start + BATCH_SIZE;

        // Check if we've reached the end
        if (start >= currentIds.length) {
            console.log('Reached end of list');
            return;
        }

        const batchIds = currentIds.slice(start, end);
        if (batchIds.length === 0) {
            console.log('No more movies to load');
            return;
        }

        loadingRef.current = true;
        setLoading(true);

        try {
            const moviesPromises = batchIds.map(async (id) => {
                try {
                    const movie = await getMovieDetails(id);
                    return movie;
                } catch (err) {
                    console.warn(`Failed to load movie with ID: ${id}`, err.message);
                    return null;
                }
            });

            const moviesData = await Promise.all(moviesPromises);

            // Filter out null values (failed requests)
            const validMovies = moviesData.filter(movie => movie !== null);

            if (validMovies.length === 0) {
                console.log('No valid movies loaded in this batch');
                setPage(prev => prev + 1); // Still increment page to move forward
                return;
            }

            const formatted = validMovies.map(movie => ({
                id: movie.id,
                title: movie.title,
                year: movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : 'N/A',
                rating: movie.vote_average
                    ? movie.vote_average.toFixed(1)
                    : 'N/A',
                runtime: movie.runtime || 0,
                genres: movie.genres
                    ? movie.genres.map(g => g.name)
                    : ['Unknown'],
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : null,
                status: type
            }));

            setMovies(prev => {
                // Prevent duplicates
                const existingIds = new Set(prev.map(m => m.id));
                const newMovies = formatted.filter(m => !existingIds.has(m.id));
                console.log(`Adding ${newMovies.length} new movies`);
                return [...prev, ...newMovies];
            });

            setPage(prev => prev + 1);
        } catch (err) {
            console.error('Error loading movies:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [page, type]);

    // Initial load
    useEffect(() => {
        if (!hasLoadedInitialRef.current && ids.length > 0) {
            hasLoadedInitialRef.current = true;
            loadMore();
        }
    }, [type, ids.length]);

    const hasMore = page * BATCH_SIZE < total;

    const resetAndReload = useCallback(() => {
        setMovies([]);
        setPage(0);
        setError(null);

        loadingRef.current = false;
        hasLoadedInitialRef.current = false;

        // ODMAH ponovo učitaj početni batch
        loadMore();
    }, [loadMore]);

    return {
        movies,
        loading,
        error,
        loadMore,
        hasMore,
        totalMovies: total,
        loadedMovies: movies.length,
        resetAndReload
    };
}