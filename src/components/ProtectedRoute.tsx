import { useAuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: {children: React.ReactNode}) {
    const { user, loading } = useAuthContext();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return (
            <Navigate
                to={`/auth?view=login&redirect=${encodeURIComponent(
                    location.pathname + location.search
                )}`}
                replace
            />
        );
    }

    return children;
}
