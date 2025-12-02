import { Play, Check, X, Star, Calendar, Clock } from 'lucide-react';

export function MovieCard({ movie, onToggleStatus, onRemove }) {
    return (
        <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden bg-slate-800">
                <img
                    src={movie.poster || 'https://via.placeholder.com/300x450/1e293b/8b5cf6?text=No+Image'}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450/1e293b/8b5cf6?text=No+Image';
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>

                <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {movie.year}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {movie.runtime}m
                    </span>
                </div>

                {/* Genres - prikazuje sve žanrove */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genres && movie.genres.map((genre, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg"
                        >
                            {genre}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {movie.rating}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggleStatus(movie.id)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${movie.status === 'toWatch'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                            }`}
                    >
                        {movie.status === 'toWatch' ? (
                            <><Check className="inline w-4 h-4 mr-1" />Watched</>
                        ) : (
                            <><Play className="inline w-4 h-4 mr-1" />Rewatch</>
                        )}
                    </button>
                    <button
                        onClick={() => onRemove(movie.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}