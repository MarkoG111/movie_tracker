import MovieItem from "./MovieItem";

export default function MovieList({ movies, onToggleStatus, onRemove }) {
    return (
        <div className="mx-auto px-4 py-10">

            <div className="
                grid 
                grid-cols-2 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-6
                gap-10
            ">
                {movies.map(movie => (
                    <MovieItem
                        key={movie.imdbId}
                        movie={movie}
                        onToggleStatus={() => onToggleStatus(movie.imdbId)}
                        onRemove={() => onRemove(movie.imdbId)}
                    />
                ))}
            </div>

        </div>
    );
}
