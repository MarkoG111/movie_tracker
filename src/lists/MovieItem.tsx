import MovieCard from "../components/movies/MovieCard";
import { Movie } from "../types/Movie";
import { useLocation, useNavigate } from "react-router-dom";

interface MovieItemProps {
    movie: Movie;
    onOpenDetails: () => void;
    onToggleStatus: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function MovieItem({
    movie,
    onOpenDetails,
    onToggleStatus,
    onRemove,
}: MovieItemProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const openDetails = () => {
        onOpenDetails();
        navigate(`/movie/${movie.imdbId}`, {
            state: { returnTo: location.pathname },
        });
    };

    return (
        <MovieCard
            movie={movie}
            onClick={openDetails}
            onToggleStatus={onToggleStatus}
            onRemove={onRemove}
        />
    );
}
