import { useState, useEffect } from 'react';
import { getToWatchIds, getWatchedIds } from '../services/moviesService';
import { getMovieDetails } from '../api/tmdb';

export function useMovies(type) {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ids = type === "watched"
            ? getWatchedIds().slice(0, 18)
            : getToWatchIds().slice(0, 18);

        console.log(ids);

        Promise.all(ids.map(id => getMovieDetails(id)))
            .then(moviesData => {
                const formattedMovies = moviesData.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
                    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
                    runtime: movie.runtime || 0,
                    genres: movie.genres ? movie.genres.map(g => g.name) : ['Unknown'],
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null,
                    status: type
                }));

                setMovies(formattedMovies);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [type]);

    const toggleStatus = (id) => {
        setMovies(movies.map(m =>
            m.id === id
                ? { ...m, status: m.status === 'toWatch' ? 'watched' : 'toWatch' }
                : m
        ));
    };

    const removeMovie = (id) => {
        setMovies(movies.filter(m => m.id !== id));
    };

    return { movies, loading, error, toggleStatus, removeMovie, setMovies };
}