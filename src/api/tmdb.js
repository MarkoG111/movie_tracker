const API_KEY = '27c8b7ac16a918ff00e8a298d9a5e3d7';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getMovieDetails(id) {
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

                return await response.json();
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

        return await response.json();
    } catch (error) {
        console.error(`Error fetching movie ${id}:`, error.message);
        throw error;
    }
}