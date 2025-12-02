import { useState, useMemo } from 'react';

export function useMovieFilters(movies) {
    const [activeTab, setActiveTab] = useState('toWatch');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [sortBy, setSortBy] = useState('title');

    const allGenres = useMemo(() => {
        const genreSet = new Set();
        movies.forEach(movie => {
            if (movie.genres) {
                movie.genres.forEach(genre => genreSet.add(genre));
            }
        });
        return ['all', ...Array.from(genreSet).sort()];
    }, [movies]);

    const filteredMovies = useMemo(() => {
        return movies
            .filter(m => m.status === activeTab)
            .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(m => selectedGenre === 'all' || (m.genres && m.genres.includes(selectedGenre)))
            .sort((a, b) => {
                if (sortBy === 'title') return a.title.localeCompare(b.title);
                if (sortBy === 'year') return b.year - a.year;
                if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
                return 0;
            });
    }, [movies, activeTab, searchQuery, selectedGenre, sortBy]);

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        allGenres,
        filteredMovies
    };
}