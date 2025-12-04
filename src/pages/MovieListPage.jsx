import { useEffect, useRef, useState, useMemo } from 'react';
import { useMovies } from '../hooks/useMovies';
import { MovieHeader } from '../components/MovieHeader';
import { MovieGrid } from '../components/MovieGrid';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

/**
 * Zajednička komponenta za prikaz liste filmova
 * @param {string} activeTab - 'toWatch' ili 'watched'
 */
export function MovieListPage({ activeTab }) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [sortBy, setSortBy] = useState('title');

    const {
        movies,
        loading,
        loadingMore,
        error,
        loadMore,
        hasMore,
        applyFilters,
        totalMovies,
        loadedMovies
    } = useMovies(activeTab);

    // Dinamički generiši žanrove
    const allGenres = useMemo(() => {
        const genreSet = new Set();
        movies.forEach(movie => {
            if (movie.genres) {
                movie.genres.forEach(genre => genreSet.add(genre));
            }
        });
        return ['all', ...Array.from(genreSet).sort()];
    }, [movies]);

    // Inicijalno učitavanje
    useEffect(() => {
        applyFilters('', 'all', 'title');
    }, [activeTab, applyFilters]);

    // Primeni filtere
    const handleApplyFilters = () => {
        applyFilters(searchQuery, selectedGenre, sortBy);
    };

    // Infinite Scroll
    const loaderRef = useRef();
    const observerRef = useRef();

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        if (!hasMore || loadingMore) return;

        observerRef.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '300px' }
        );

        if (loaderRef.current) observerRef.current.observe(loaderRef.current);

        return () => observerRef.current?.disconnect();
    }, [hasMore, loadingMore, loadMore]);

    if (loading && movies.length === 0) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <MovieHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortBy={sortBy}
                setSortBy={setSortBy}
                allGenres={allGenres}
                onApplyFilters={handleApplyFilters}
                activeTab={activeTab}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {movies.length === 0 && !loading ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-xl text-white">No movies yet</p>
                        <p className="text-gray-400 mt-2">Start adding movies to your list!</p>
                    </div>
                ) : (
                    <>
                        <MovieGrid movies={movies} />

                        {loadingMore && (
                            <div className="flex justify-center py-8 text-center">
                                <div>
                                    <div className="text-4xl mb-2 animate-bounce">🎬</div>
                                    <p className="text-white">Loading more movies...</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {loadedMovies} of {totalMovies} loaded
                                    </p>
                                </div>
                            </div>
                        )}

                        {hasMore && !loadingMore && (
                            <div ref={loaderRef} className="h-20 flex items-center justify-center text-gray-500 text-sm">
                                Scroll for more...
                            </div>
                        )}

                        {!hasMore && movies.length > 0 && (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-3">🎉</div>
                                <p className="text-xl text-white font-semibold">That's all!</p>
                                <p className="text-gray-400 mt-2">
                                    You've loaded all {totalMovies} movies
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}