import { useState, useEffect, useRef } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useMovieFilters } from '../hooks/useMovieFilters';
import { MovieHeader } from '../components/MovieHeader';
import { MovieGrid } from '../components/MovieGrid';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export default function WatchedPage() {
    const {
        movies,
        loading,
        error,
        loadMore,
        hasMore,
        totalMovies,
        loadedMovies,
        resetAndReload
    } = useMovies('watched');

    const [showFilters, setShowFilters] = useState(false);

    const loaderRef = useRef();
    const observerRef = useRef();

    useEffect(() => {
        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Don't create observer if no more content or currently loading
        if (!hasMore || loading) {
            return;
        }

        observerRef.current = new IntersectionObserver(
            entries => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loading) {
                    console.log('Intersection detected, loading more...');
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '390px' 
            }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observerRef.current.observe(currentLoader);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading]);

    const {
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        allGenres
    } = useMovieFilters(movies);

    // kada se promeni filter, resetuj
    useEffect(() => {
        resetAndReload();
    }, [searchQuery, selectedGenre, sortBy]);

    if (loading && movies.length === 0) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <MovieHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
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
                {movies.length === 0 && !loading ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-xl text-white">No movies yet</p>
                        <p className="text-gray-400 mt-2">Start adding movies to your list!</p>
                    </div>
                ) : (
                    <>
                        <MovieGrid movies={movies} />

                        {/* Loading indicator for infinite scroll */}
                        {loading && movies.length > 0 && (
                            <div className="flex justify-center py-8">
                                <div className="text-center">
                                    <div className="text-4xl mb-2 animate-bounce">🎬</div>
                                    <p className="text-white">Loading more movies...</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {loadedMovies} of {totalMovies} loaded
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Invisible trigger for infinite scroll */}
                        {hasMore && !loading && (
                            <div
                                ref={loaderRef}
                                className="h-20 flex items-center justify-center"
                            >
                                <div className="text-gray-500 text-sm">
                                    Scroll for more...
                                </div>
                            </div>
                        )}

                        {/* End of list indicator */}
                        {!hasMore && movies.length > 0 && (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-3">🎉</div>
                                <p className="text-xl text-white font-semibold">
                                    That's all!
                                </p>
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
