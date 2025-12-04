import { Search, Filter, Play, Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MovieHeader({
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    allGenres,
    onApplyFilters,
    toWatchCount,
    watchedCount
}) {
    const location = useLocation();
    const activeTab = location.pathname === "/watched" ? "watched" : "toWatch";

    return (
        <header
            className="
                sticky top-0 z-40 
                bg-[#0d0d0f]/95 backdrop-blur-xl
                border-b border-[#1f1f22]
                shadow-[0_2px_20px_-5px_rgba(0,0,0,0.6)]
            "
        >
            <div className="max-w-7xl mx-auto px-6 py-6">

                {/* Title */}
                <h1 className="
                    text-4xl font-extrabold mb-6
                    bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 
                    bg-clip-text text-transparent
                    drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]
                ">
                    🎬 Movie Tracker
                </h1>

                {/* Search Input */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
                            w-full pl-12 pr-4 py-3 
                            bg-[#1a1a1d] border border-[#2a2a2d]
                            rounded-xl text-white 
                            placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-cyan-500/60
                            transition-all
                            shadow-inner shadow-black/40
                        "
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">

                    <Link
                        to="/toWatch"
                        className={`
                            flex-1 py-3 text-center font-semibold rounded-xl
                            transition-all shadow-md
                            ${activeTab === "toWatch"
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-cyan-500/40"
                                : "bg-[#1a1a1d] text-gray-400 hover:text-white hover:bg-[#242428]"
                            }
                        `}
                    >
                        <Play className="inline w-4 h-4 mr-2" />
                        To Watch ({toWatchCount})
                    </Link>

                    <Link
                        to="/watched"
                        className={`
                            flex-1 py-3 text-center font-semibold rounded-xl
                            transition-all shadow-md
                            ${activeTab === "watched"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-teal-500/40"
                                : "bg-[#1a1a1d] text-gray-400 hover:text-white hover:bg-[#242428]"
                            }
                        `}
                    >
                        <Check className="inline w-4 h-4 mr-2" />
                        Watched ({watchedCount})
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap">

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="
                            px-4 py-2 bg-[#1a1a1d] border border-[#2e2e31]
                            text-gray-300 rounded-xl flex items-center gap-2
                            hover:bg-[#242428] hover:text-white transition-all
                        "
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>

                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3">

                            {/* Genre */}
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="
                                    px-4 py-2 bg-[#1a1a1d] border border-[#2e2e31]
                                    rounded-xl text-gray-200
                                    focus:ring-2 focus:ring-cyan-500/60
                                "
                            >
                                {allGenres.map(g => (
                                    <option key={g} value={g} className="bg-black">
                                        {g === "all" ? "All genres" : g}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="
                                    px-4 py-2 bg-[#1a1a1d] border border-[#2e2e31]
                                    rounded-xl text-gray-200
                                    focus:ring-2 focus:ring-cyan-500/60
                                "
                            >
                                <option value="title" className="bg-black">Sort by Title</option>
                                <option value="year" className="bg-black">Sort by Year</option>
                                <option value="rating" className="bg-black">Sort by Rating</option>
                            </select>

                            <button
                                onClick={onApplyFilters}
                                className="
                                    px-5 py-2 font-semibold rounded-xl 
                                    bg-gradient-to-r from-blue-600 to-cyan-600 
                                    text-white shadow-lg shadow-cyan-500/30
                                    hover:from-blue-700 hover:to-cyan-700
                                    transition-all
                                "
                            >
                                Apply
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}