import { useMovies } from "../hooks/useMovies";
import MovieHeader from "../components/MovieHeader";
import MovieList from "../lists/MovieList";

export default function ToWatchPage() {
    const {
        toWatchMovies,
        watchedMovies,
        moveToWatched,
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
                movies={toWatchMovies}
                onToggleStatus={moveToWatched}
                onRemove={removeMovie}
            />
        </>
    );
}
