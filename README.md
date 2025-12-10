# 🎬 Movie Tracker

Movie Tracker is a personal movie tracking app built with React, TypeScript, Supabase, and TailwindCSS. <br/> 
Users can log in, add movies by IMDb ID or URL, and manage watched and to-watch lists. <br/>
Movie details (cast, posters, overview, rating, images) come from TMDB.

# 🚀 Features

## 🔐 Authentication
- Email/password login using Supabase
- Protected routes
- Each user has their own private movie library

## 🎬 Movie Management
- Add movies using IMDb ID or URL
- TMDB is used to fetch rich metadata
- Movies stored in Supabase:
1. movie_details - global metadata
2. movies - user-specific list (watched / toWatch)

## 📚 Lists
- To-Watch list
- Watched list
- Move movies between lists
- Remove movies

## 🔍 Filtering & Search
- Search by title
- Filter by genre
- Sort by title, year, or rating

# 🛠️ Tech Stack
- React + TypeScript
- TailwindCSS
- Supabase Auth & Database
- TMDB API
- Vite

# 📦 Installation
```bash
git clone https://github.com/YOUR_USERNAME/MovieTracker.git
cd my_movies
npm install
npm run dev
```

Create a .env file:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_TMDB_API_KEY=
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```
