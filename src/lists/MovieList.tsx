import { useEffect, useRef, useState } from "react";
import MovieItem from "./MovieItem";
import BackToTopButton from "../components/layout/BackToTopButton";
import { Movie } from "../types/Movie";

interface MovieListProps {
    movies: Movie[];
    onToggleStatus: (id: string) => void;
    onRemove: (id: string) => void;
    isFiltered?: boolean;
}

export default function MovieList({
    movies,
    onToggleStatus,
    onRemove,
    isFiltered = false,
}: MovieListProps) {
    const [visibleCount, setVisibleCount] = useState(18);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const hasMore = visibleCount < movies.length;
    const visibleMovies = movies.slice(0, visibleCount);

    // Reset visible count when movies change (new filter applied)
    useEffect(() => {
        setVisibleCount(18);
    }, [movies]);

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore) return; // nothing more to load

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount((prev) => prev + 18);
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, movies]);

    // Empty state
    if (movies.length === 0) {
        return (
            <div className="mx-auto px-4 py-20 text-center">
                <p className="text-xl text-gray-500">
                    {isFiltered
                        ? "No movies found matching your filters."
                        : "Your list is empty. Add some movies!"}
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
                {visibleMovies.map((movie) => (
                    <MovieItem
                        key={movie.imdbId}
                        movie={movie}
                        onToggleStatus={() => onToggleStatus(movie.imdbId)}
                        onRemove={() => onRemove(movie.imdbId)}
                    />
                ))}
            </div>

            {/* Loader is now independent of filters */}
            {hasMore ? (
                <div
                    ref={loaderRef}
                    className="h-20 mt-10 flex justify-center items-center text-gray-400 text-lg"
                >
                    Loading more movies...
                </div>
            ) : visibleMovies.length > 18 ? (
                <div className="mt-10 text-center text-gray-400">
                    You've reached the end!
                </div>
            ) : null}

            <BackToTopButton />
        </div>
    );
}
