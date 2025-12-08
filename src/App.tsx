import { BrowserRouter, Routes, Route } from "react-router-dom";

import ToWatchPage from "./pages/ToWatchPage";
import WatchedPage from "./pages/WatchedPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPages from "./components/layout/AuthPages";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public auth routes */}
                    <Route path="/auth" element={<AuthPages />} />

                    {/* Protected app routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <ToWatchPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/toWatch"
                        element={
                            <ProtectedRoute>
                                <ToWatchPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/watched"
                        element={
                            <ProtectedRoute>
                                <WatchedPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/movie/:id"
                        element={
                            <ProtectedRoute>
                                <MovieDetailsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
