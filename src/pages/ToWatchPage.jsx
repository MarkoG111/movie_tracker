import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useMovieFilters } from '../hooks/useMovieFilters';
import { MovieHeader } from '../components/MovieHeader';
import { MovieGrid } from '../components/MovieGrid';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export default function ToWatchPage() {
    const { movies, loading, error, toggleStatus, removeMovie } = useMovies();
    const [showFilters, setShowFilters] = useState(false);

    const {
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
    } = useMovieFilters(movies);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <MovieHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                movies={movies}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortBy={sortBy}
                setSortBy={setSortBy}
                allGenres={allGenres}
            />

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MovieGrid
                    movies={filteredMovies}
                    onToggleStatus={toggleStatus}
                    onRemove={removeMovie}
                />
            </div>
        </div>
    );
}