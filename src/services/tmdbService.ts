import { MovieDetails } from "../types/MovieDetails";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const IMG = "https://image.tmdb.org/t/p/original";

function buildUrl(path: string, params: Record<string, string | number> = {}) {
    const url = new URL(BASE_URL + path);

    url.searchParams.set("api_key", API_KEY);

    Object.entries(params).forEach(([k, v]) =>
        url.searchParams.set(k, String(v))
    );

    return url.toString();
}

async function get<T>(path: string, params = {}): Promise<T> {
    const res = await fetch(buildUrl(path, params));

    if (!res.ok) {
        throw new Error(`TMDB error: ${res.status}`);
    }

    return res.json();
}

//  1) Resolve IMDb → TMDB numeric ID
export async function fetchTMDBId(imdbId: string): Promise<number | null> {
    const data = await get<any>(`/find/${imdbId}`, {external_source: "imdb_id",});

    return data.movie_results?.[0]?.id ?? null;
}

//  2) Fetch full TMDB movie details
export async function fetchTMDBDetails(
    tmdbId: number
): Promise<MovieDetails | null> {
    const data = await get<any>(`/movie/${tmdbId}`, {
        append_to_response: "credits,images,videos,reviews",
        include_image_language: "en,null",
    });

    if (!data) {
        return null;
    }

    return {
        imdbId: data.imdb_id ?? "",
        title: data.title,
        year: Number(data.release_date?.slice(0, 4) ?? 0),
        rating: data.vote_average.toFixed(1) ?? 0,
        runtime: data.runtime ?? 0,
        poster: data.poster_path ? IMG + data.poster_path : "",
        backdrop: data.backdrop_path ? IMG + data.backdrop_path : undefined,
        tagline: data.tagline || undefined,
        overview: data.overview || undefined,
        genres: data.genres?.map((g: any) => g.name) ?? [],
        status: "toWatch", // your context will override this
        budget: data.budget || null,
        revenue: data.revenue || null,

        director:
            data.credits?.crew?.find((c: any) => c.job === "Director")?.name ??
            null,

        cast:
            data.credits?.cast
                ?.sort((a: any, b: any) => a.order - b.order)
                ?.slice(0, 8)
                ?.map((c: any) => c.name) ?? [],

        images:
            [...(data.images?.backdrops ?? []), ...(data.images?.posters ?? [])]
                ?.slice(0, 20)
                ?.map((img: any) => IMG + img.file_path) ?? [],

        videos:
            data.videos?.results?.map((v: any) => ({
                key: v.key,
                name: v.name,
                site: v.site,
                type: v.type,
            })) ?? [],

        reviews:
            data.reviews?.results?.map((r: any) => ({
                author: r.author,
                content: r.content,
                url: r.url,
            })) ?? [],
    };
}
