export function LoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-xl text-white">Loading movies...</p>
            </div>
        </div>
    );
}