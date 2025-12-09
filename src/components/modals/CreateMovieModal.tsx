import { useState } from "react";
import { X, Loader2 } from "lucide-react";

import { useMoviesContext } from "../../context/MoviesContext";
import { fetchTMDBDetails, fetchTMDBId } from "../../services/tmdbService";
import { MovieDetails } from "../../types/MovieDetails";
import { showToast } from "../ui/ToastContainer";

interface CreateMovieModalProps {
    onClose: () => void;
    defaultStatus?: "toWatch" | "watched";
}

export default function CreateMovieModal({
    onClose,
    defaultStatus = "toWatch",
}: CreateMovieModalProps) {
    const { addMovieByIMDb } = useMoviesContext();

    const [imdbUrl, setImdbUrl] = useState("");
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<"toWatch" | "watched">(
        defaultStatus
    );

    const handleCloseModal = () => {
        setImdbUrl("");
        setMovieDetails(null);
        setError(null);
        setLoading(false);
        onClose();
    };

    async function handleUrlChange(value: string) {
        setImdbUrl(value);
        setMovieDetails(null);
        setError(null);

        const imdbId = value.match(/tt\d+/)?.[0];
        if (!imdbId) {
            // don't fetch until we have a valid looking id
            return;
        }

        setLoading(true);
        try {
            const tmdbId = await fetchTMDBId(imdbId);
            if (!tmdbId) {
                showToast("Movie not found on TMDB", "error");
                setLoading(false);
                return;
            }

            const details = await fetchTMDBDetails(tmdbId);
            if (!details) {
                showToast("Could not load movie details", "error");
                setLoading(false);
                return;
            }

            setMovieDetails(details);
        } catch (err) {
            console.error(err);
            showToast("Failed to fetch movie details", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveMovie() {
        if (!imdbUrl || !movieDetails) return;

        setLoading(true);
        setError(null);

        try {
            await addMovieByIMDb(imdbUrl, selectedStatus);
            const statusText = selectedStatus === "watched" ? "Watched" : "To Watch";
            showToast(`🎬 "${movieDetails.title}" added to ${statusText}!`, "success");
            handleCloseModal();
        } catch (err) {
            console.error(err);
            showToast("Could not save movie", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#1a1a1d] rounded-2xl border border-[#2e2e31] shadow-2xl shadow-cyan-500/10 animate-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#2e2e31]">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Add New Movie
                    </h2>
                    <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-[#2a2a2d] rounded-lg transition-colors group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* URL Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            IMDB URL or ID
                        </label>
                        <input
                            type="text"
                            placeholder="https://www.imdb.com/title/tt0133093/"
                            value={imdbUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            className="
                                w-full px-4 py-3 
                                bg-[#0d0d0f] border border-[#2e2e31]
                                rounded-xl text-white 
                                placeholder-gray-600
                                focus:outline-none focus:ring-2 focus:ring-cyan-500/60
                                transition-all
                            "
                        />
                    </div>

                    {/* Status Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Add to
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedStatus("toWatch")}
                                className={`
                                    flex-1 py-3 px-4 rounded-xl font-medium
                                    transition-all duration-200
                                    flex items-center justify-center gap-2
                                    ${
                                        selectedStatus === "toWatch"
                                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 border-2 border-cyan-400/50"
                                            : "bg-[#1a1a1d] text-gray-400 border-2 border-[#2e2e31] hover:text-white hover:bg-[#242428] hover:border-[#3e3e41]"
                                    }
                                `}
                            >
                                <span className="text-xl">📺</span>
                                <span>To Watch</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedStatus("watched")}
                                className={`
                                    flex-1 py-3 px-4 rounded-xl font-medium
                                    transition-all duration-200
                                    flex items-center justify-center gap-2
                                    ${
                                        selectedStatus === "watched"
                                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-teal-500/30 border-2 border-teal-400/50"
                                            : "bg-[#1a1a1d] text-gray-400 border-2 border-[#2e2e31] hover:text-white hover:bg-[#242428] hover:border-[#3e3e41]"
                                    }
                                `}
                            >
                                <span className="text-xl">✅</span>
                                <span>Watched</span>
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        </div>
                    )}

                    {/* Movie Preview */}
                    {!loading && movieDetails && (
                        <div className="bg-[#0d0d0f] rounded-xl p-6 border border-[#2e2e31]">
                            <div className="flex gap-6">
                                {/* Poster */}
                                <div className="flex-shrink-0">
                                    {movieDetails.poster ? (
                                        <img
                                            src={movieDetails.poster}
                                            alt={movieDetails.title}
                                            className="w-32 h-48 object-cover rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-48 rounded-lg bg-[#1f1f23] flex items-center justify-center text-gray-500 text-sm">
                                            No poster
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {movieDetails.title}
                                        </h3>
                                        <p className="text-gray-400">
                                            {movieDetails.year}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-400 text-lg">
                                                ⭐
                                            </span>
                                            <span className="text-white font-semibold">
                                                {movieDetails.rating}
                                            </span>
                                        </div>

                                        {movieDetails.genres &&
                                            movieDetails.genres.length > 0 && (
                                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
                                                    {movieDetails.genres.join(
                                                        ", "
                                                    )}
                                                </span>
                                            )}
                                    </div>

                                    {movieDetails.overview && (
                                        <p className="text-gray-400 text-sm line-clamp-3">
                                            {movieDetails.overview}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2e2e31]">
                    <button
                        onClick={handleCloseModal}
                        className="
                            px-6 py-2.5 
                            bg-[#2a2a2d] text-gray-300
                            rounded-xl font-medium
                            hover:bg-[#35353a] hover:text-white
                            transition-all
                        "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveMovie}
                        disabled={!movieDetails || loading}
                        className="
                            px-6 py-2.5 
                            bg-gradient-to-r from-blue-600 to-cyan-600
                            text-white rounded-xl font-medium
                            hover:from-blue-700 hover:to-cyan-700
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all
                            shadow-lg shadow-cyan-500/20
                        "
                    >
                        Add Movie
                    </button>
                </div>
            </div>
        </div>
    );
}
