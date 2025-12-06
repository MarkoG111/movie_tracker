import MovieCard from "../components/movies/MovieCard";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";

interface MovieItemProps {
  movie: Movie;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function MovieItem({
  movie,
  onToggleStatus,
  onRemove,
}: MovieItemProps) {
  const navigate = useNavigate();

  const openDetails = () => navigate(`/movie/${movie.imdbId}`);

  return (
    <MovieCard
      movie={movie}
      onClick={openDetails}
      onToggleStatus={onToggleStatus}
      onRemove={onRemove}
    />
  );
}
