const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

// Cache za API odgovore - sprečava duple pozive
const movieCache = new Map();

export async function getMovieDetails(id) {
    // Proveri cache prvo 
    if (movieCache.has(id)) {
        return movieCache.get(id);
    }

    try {
        // Check if it's an IMDb ID (starts with "tt")
        if (typeof id === 'string' && id.startsWith('tt')) {
            // First convert IMDb ID to TMDB ID
            const findResponse = await fetch(
                `${BASE_URL}/find/${id}?api_key=${API_KEY}&external_source=imdb_id`
            );

            if (!findResponse.ok) {
                throw new Error(`IMDb ID lookup failed: ${id}`);
            }

            const findData = await findResponse.json();

            if (findData.movie_results && findData.movie_results.length > 0) {
                const tmdbId = findData.movie_results[0].id;

                // Now fetch details with TMDB ID
                const response = await fetch(
                    `${BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}&language=en-US`
                );

                if (!response.ok) {
                    throw new Error(`Movie details fetch failed: ${tmdbId}`);
                }

                const data = await response.json();

                // Sačuvaj u cache sa oba ID-a
                movieCache.set(id, data);           // IMDb ID
                movieCache.set(tmdbId, data);       // TMDB ID

                return data;
            } else {
                throw new Error(`No movie found for IMDb ID: ${id}`);
            }
        }

        // If it's already a TMDB ID, use it directly
        const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`Movie details fetch failed: ${id}`);
        }

        const data = await response.json();

        movieCache.set(id, data); // Sačuvaj u cache

        return data;
    } catch (error) {
        console.error(`Error fetching movie ${id}:`, error.message);
        throw error;
    }
}