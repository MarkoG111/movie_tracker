interface ErrorStateProps {
    error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-xl text-red-400">Error: {error}</p>
            </div>
        </div>
    );
}
