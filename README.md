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
- React <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge" />
- TypeScript  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
- TailwindCSS  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" />
- Supabase Auth & Database  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white&style=for-the-badge" />
- TMDB API  <img src="https://img.shields.io/badge/TMDB-01D277?logo=tmdb&logoColor=white&style=for-the-badge" />
- Vite  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge" />

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
