import { useMovies } from "../hooks/useMovies";
import MovieList from "../lists/MovieList";
import MovieHeader from "../components/MovieHeader";

export default function WatchedPage() {
    const {
        toWatchMovies,
        watchedMovies,
        moveToWatch,
        removeMovie
    } = useMovies();

    return (
        <>
            <MovieHeader
                toWatchCount={toWatchMovies.length}
                watchedCount={watchedMovies.length}

                // filter props:
                searchQuery=""
                setSearchQuery={() => { }}
                showFilters={false}
                setShowFilters={() => { }}
                selectedGenre="all"
                setSelectedGenre={() => { }}
                sortBy="title"
                setSortBy={() => { }}
                allGenres={["all"]}
                onApplyFilters={() => { }}
            />

            <MovieList
                movies={watchedMovies}
                onToggleStatus={moveToWatch}
                onRemove={removeMovie}
            />
        </>
    );
}
