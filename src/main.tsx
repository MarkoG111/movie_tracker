import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { MoviesProvider } from "./context/MoviesContext";
import { TMDBProvider } from "./context/TMDBContext";
import { AuthProvider } from "./context/AuthContext";

// Find the root container in index.html
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Create a root and render the App
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <MoviesProvider>
                <TMDBProvider>
                    <App />
                </TMDBProvider>
            </MoviesProvider>
        </AuthProvider>
    </React.StrictMode>
);
