import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MovieItem from "./MovieItem";
import BackToTopButton from "../components/layout/BackToTopButton";
import { Movie } from "../types/Movie";
import {
    clearListScrollRestore,
    computeVisibleCountForIndex,
} from "../utils/listScrollRestore";

interface ScrollRestoreProps {
    scrollY: number;
    visibleCount: number;
    movieImdbId: string;
}

interface MovieListProps {
    movies: Movie[];
    onToggleStatus: (id: string) => void;
    onRemove: (id: string) => void;
    onOpenDetails: (imdbId: string, index: number, visibleCount: number) => void;
    scrollRestore?: ScrollRestoreProps;
    isFiltered?: boolean;
}

export default function MovieList({
    movies,
    onToggleStatus,
    onRemove,
    onOpenDetails,
    scrollRestore,
    isFiltered = false,
}: MovieListProps) {
    const restoreRef = useRef(scrollRestore);
    const restoreStartedRef = useRef(false);
    const restoreDoneRef = useRef(false);
    const prevMoviesLengthRef = useRef(movies.length);

    const [visibleCount, setVisibleCount] = useState(() => {
        if (!scrollRestore) {
            return 18;
        }

        return scrollRestore.visibleCount;
    });
    const [isRestoring, setIsRestoring] = useState(!!scrollRestore);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const hasMore = visibleCount < movies.length;
    const visibleMovies = movies.slice(0, visibleCount);

    useEffect(() => {
        if (!isRestoring) {
            return;
        }

        const previous = history.scrollRestoration;
        history.scrollRestoration = "manual";

        return () => {
            history.scrollRestoration = previous;
        };
    }, [isRestoring]);

    useEffect(() => {
        if (prevMoviesLengthRef.current === movies.length) {
            return;
        }

        prevMoviesLengthRef.current = movies.length;

        if (isRestoring) {
            return;
        }

        setVisibleCount(18);
    }, [movies.length, isRestoring]);

    useLayoutEffect(() => {
        const restore = restoreRef.current;
        if (!restore || !isRestoring || restoreStartedRef.current) {
            return;
        }

        if (movies.length === 0) {
            return;
        }

        const movieIndex = movies.findIndex(
            (m) => m.imdbId === restore.movieImdbId
        );

        const neededCount = Math.min(
            Math.max(
                restore.visibleCount,
                movieIndex >= 0
                    ? computeVisibleCountForIndex(movieIndex)
                    : restore.visibleCount
            ),
            movies.length
        );

        if (visibleCount < neededCount) {
            setVisibleCount(neededCount);
            return;
        }

        restoreStartedRef.current = true;

        const finishRestore = () => {
            if (restoreDoneRef.current) {
                return;
            }

            restoreDoneRef.current = true;
            setIsRestoring(false);
            clearListScrollRestore();
        };

        const scrollToMovie = () => {
            const card = document.querySelector(
                `[data-movie-id="${restore.movieImdbId}"]`
            );

            if (card) {
                card.scrollIntoView({ block: "center" });
                return true;
            }

            const maxScroll = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight
            );
            window.scrollTo(0, Math.min(restore.scrollY, maxScroll));
            return false;
        };

        scrollToMovie();

        let attempts = 0;
        const retry = () => {
            if (attempts >= 15) {
                finishRestore();
                return;
            }

            attempts += 1;
            scrollToMovie();
            window.setTimeout(retry, 50);
        };

        window.setTimeout(retry, 50);
        window.setTimeout(finishRestore, 800);
    }, [visibleCount, movies.length, isRestoring]);

    useEffect(() => {
        if (!hasMore || isRestoring) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => prev + 18);
                }
            },
            { rootMargin: "200px" }
        );

        const loader = loaderRef.current;
        if (loader) {
            observer.observe(loader);
        }

        return () => observer.disconnect();
    }, [hasMore, movies.length, isRestoring]);

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
                {visibleMovies.map((movie, index) => (
                    <MovieItem
                        key={movie.imdbId}
                        movie={movie}
                        onOpenDetails={() =>
                            onOpenDetails(movie.imdbId, index, visibleCount)
                        }
                        onToggleStatus={() => onToggleStatus(movie.imdbId)}
                        onRemove={() => onRemove(movie.imdbId)}
                    />
                ))}
            </div>

            {hasMore && !isRestoring ? (
                <div
                    ref={loaderRef}
                    className="h-20 mt-10 flex justify-center items-center text-gray-400 text-lg"
                >
                    Loading more movies...
                </div>
            ) : visibleMovies.length > 18 && !hasMore ? (
                <div className="mt-10 text-center text-gray-400">
                    You've reached the end!
                </div>
            ) : null}

            <BackToTopButton />
        </div>
    );
}
