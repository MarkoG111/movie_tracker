import toWatchIds from "../data/toWatch.json";
import watchedIds from "../data/watched.json";

const STORAGE_KEY = "myMovies";

export function loadMovies() {
    const raw = localStorage.getItem(STORAGE_KEY);

    // Ako već postoji localStorage → koristi njega
    if (raw) {
        return JSON.parse(raw);
    }

    // Prvo pokretanje aplikacije → MIGRACIJA iz JSON fajlova
    const initialMovies = [
        ...toWatchIds.map(id => ({
            imdbId: id,
            status: "toWatch",
            addedAt: new Date().toISOString()
        })),
        ...watchedIds.map(id => ({
            imdbId: id,
            status: "watched",
            addedAt: new Date().toISOString()
        }))
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMovies));
    return initialMovies;
}

export function saveMovies(movies) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export function addMovie(imdbId, status = "toWatch") {
    const movies = loadMovies();

    // Ako već postoji u listi — samo promeni status
    const existing = movies.find(m => m.imdbId === imdbId);
    if (existing) {
        existing.status = status;
        saveMovies(movies);
        return movies;
    }

    const newMovie = {
        imdbId,
        status,
        addedAt: new Date().toISOString(),
    };

    const updated = [newMovie, ...movies];
    saveMovies(updated);
    return updated;
}

export function updateMovieStatus(imdbId, newStatus) {
    const movies = loadMovies();
    const movie = movies.find(m => m.imdbId === imdbId);

    if (!movie) return movies;

    movie.status = newStatus;
    saveMovies(movies);

    return movies;
}

export function removeMovie(imdbId) {
    const movies = loadMovies();
    const updated = movies.filter(m => m.imdbId !== imdbId);
    saveMovies(updated);
    return updated;
}
