import { useMovieDetails } from "../hooks/useMovieDetails";
import MovieCard from "../components/MovieCard";

export default function MovieItem({ movie, onToggleStatus, onRemove }) {
    const details = useMovieDetails(movie.imdbId);

    if (!details) {
        return <div className="h-[300px] bg-slate-500 rounded-xl animate-pulse"></div>;
    }

    const fullMovie = {
        ...details,
        status: movie.status,
        addedAt: movie.addedAt,
    };

    return (
        <MovieCard
            movie={fullMovie}
            onToggleStatus={onToggleStatus}
            onRemove={onRemove}
        />
    );
}
