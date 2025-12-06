import { BrowserRouter, Routes, Route } from "react-router-dom";

import ToWatchPage from "./pages/ToWatchPage";
import WatchedPage from "./pages/WatchedPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ToWatchPage />} />
        <Route path="/toWatch" element={<ToWatchPage />} />
        <Route path="/watched" element={<WatchedPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
