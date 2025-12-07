import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    Play,
    Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MovieDetails } from "../types/MovieDetails";
import { useTMDB } from "../context/TMDBContext";

export default function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getDetails } = useTMDB();

    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            return;
        }

        let isMounted = true;

        setLoading(true);

        getDetails(id)
            .then((data) => {
                if (!isMounted) {
                    return;
                }

                setDetails(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);

                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [id, getDetails]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!details) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="text-white text-xl">Movie not found</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
            <div className="relative min-h-screen">
                {/* Header */}
                <div className="relative z-10 p-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 pb-12">
                    <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
                        {/* Poster */}
                        <div className="rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src={details.poster}
                                alt={details.title}
                                className="w-full"
                            />
                        </div>

                        {/* Details */}
                        <div className="text-white space-y-6">
                            {/* Title & Tagline */}
                            <div>
                                <h1 className="text-5xl font-bold mb-2">
                                    {details.title}
                                </h1>
                                {details.tagline && (
                                    <p className="text-xl text-gray-400 italic">
                                        {details.tagline}
                                    </p>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-6 text-lg">
                                <span className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                        {details.rating}
                                    </span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    {details.year}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    {details.runtime} min
                                </span>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2">
                                {details.genres.map((genre, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 rounded-lg bg-purple-600/30 text-purple-200 font-medium"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            {/* Overview */}
                            {details.overview && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-3">
                                        Overview
                                    </h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {details.overview}
                                    </p>
                                </div>
                            )}

                            {/* Financial Info */}
                            {(details.budget || details.revenue) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {details.budget && (
                                        <div className="bg-[#1a1a1d] rounded-lg p-4 border border-[#2a2a2d]">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span className="text-sm">
                                                    Budget
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold">
                                                $
                                                {(
                                                    details.budget / 1000000
                                                ).toFixed(0)}
                                                M
                                            </p>
                                        </div>
                                    )}
                                    {details.revenue && (
                                        <div className="bg-[#1a1a1d] rounded-lg p-4 border border-[#2a2a2d]">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span className="text-sm">
                                                    Revenue
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-400">
                                                $
                                                {(
                                                    details.revenue / 1000000
                                                ).toFixed(0)}
                                                M
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Director */}
                            {details.director && (
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Director
                                    </h3>
                                    <p className="text-gray-300 text-lg">
                                        {details.director}
                                    </p>
                                </div>
                            )}

                            {/* Cast */}
                            {details.cast && details.cast.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-3">
                                        Cast
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {details.cast.map((actor, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-2 rounded-lg bg-[#1a1a1d] border border-[#2a2a2d] text-gray-300"
                                            >
                                                {actor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-semibold">
                                    <Play className="w-5 h-5" />
                                    Watch Trailer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Images Gallery */}
                    {details.images && details.images.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Images
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {details.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="aspect-video rounded-lg overflow-hidden bg-[#1a1a1d]"
                                    >
                                        <img
                                            src={img}
                                            alt={`${details.title} ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
