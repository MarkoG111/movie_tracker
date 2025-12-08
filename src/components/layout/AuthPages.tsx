import { Navigate, useSearchParams } from "react-router-dom";
import Login from "../../pages/LoginPage";
import Signup from "../../pages/SignupPage";
import { useAuthContext } from "../../context/AuthContext";

export default function AuthPages() {
    const { user } = useAuthContext();
    const [params, setParams] = useSearchParams();

    const view = params.get("view") === "signup" ? "signup" : "login";

    if (user) {
        return <Navigate to="/" replace />;
    }

    const switchView = () => {
        const next = view === "login" ? "signup" : "login";
        setParams({ view: next });
    };

    return (
        <div className="relative">
            {view === "login" ? (
                <Login switchView={switchView} />
            ) : (
                <Signup switchView={switchView} />
            )}
        </div>
    );
}
