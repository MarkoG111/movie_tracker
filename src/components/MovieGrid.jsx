import { MovieCard } from './MovieCard';

export function MovieGrid({ movies, onToggleStatus, onRemove }) {
    if (movies.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-2xl font-semibold text-white mb-2">No movies found</h3>
                <p className="text-gray-400">
                    Add some movies to get started or try adjusting your filters
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {movies.map(movie => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onToggleStatus={onToggleStatus}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}