import { X, Star, Calendar, Clock } from "lucide-react";
import { Movie } from "../../types/Movie";

interface MovieCardProps {
  movie: Movie;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onClick?: () => void;
}

export default function MovieCard({
  movie,
  onToggleStatus,
  onRemove,
  onClick,
}: MovieCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden bg-[#1a1a1d] border border-[#2a2a2d] hover:border-[#3a3a3d] transition-all shadow-lg hover:shadow-xl"
    >
      {/* Poster */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-black">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-white">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">
          {movie.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {movie.year}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {movie.runtime}m
          </span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genres.slice(0, 3).map((g, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded-md bg-purple-600/20 text-purple-200 whitespace-nowrap"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 font-semibold mb-4">
          <Star className="w-4 h-4 fill-yellow-400" />
          {movie.rating}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(movie.imdbId);
            }}
            className={`flex-1 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
              movie.status === "toWatch"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {movie.status === "toWatch" ? "Watched" : "Rewatch"}
          </button>

          {/* Remove */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(movie.imdbId);
            }}
            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
