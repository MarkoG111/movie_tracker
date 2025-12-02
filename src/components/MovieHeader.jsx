import { Search, Filter, Play, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getToWatchIds, getWatchedIds } from "../services/moviesService";

export function MovieHeader({
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    allGenres
}) {
    const location = useLocation();
    const activeTab = location.pathname === "/watched" ? "watched" : "toWatch";

    const toWatchCount = getToWatchIds().length;
    const watchedCount = getWatchedIds().length;

    return (
        <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                        🎬 Movie Tracker
                    </h1>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        <Link
                            to="/toWatch"
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                                activeTab === "toWatch"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                            }`}
                        >
                            <Play className="inline w-4 h-4 mr-2" />
                            To Watch ({toWatchCount})
                        </Link>

                        <Link
                            to="/watched"
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                                activeTab === "watched"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                            }`}
                        >
                            <Check className="inline w-4 h-4 mr-2" />
                            Watched ({watchedCount})
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-white/10 rounded-xl text-white flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        {showFilters && (
                            <>
                                <select
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                                >
                                    {allGenres.map(g => (
                                        <option key={g} className="bg-slate-900" value={g}>
                                            {g === "all" ? "All Genres" : g}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                                >
                                    <option className="bg-slate-900" value="title">Sort by Title</option>
                                    <option className="bg-slate-900" value="year">Sort by Year</option>
                                    <option className="bg-slate-900" value="rating">Sort by Rating</option>
                                </select>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
