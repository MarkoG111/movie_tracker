import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEED_USER_ID = process.env.SEED_USER_ID;

// paths
const MOVIES_DICT_PATH = path.resolve("src/data/moviesDict.json");
const TO_WATCH_PATH = path.resolve("src/data/toWatchFull.json");
const WATCHED_PATH = path.resolve("src/data/watchedFull.json");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("❌ Missing Supabase env variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

(async () => {
    console.log("🚀 Starting movie metadata migration...");

    if (!fs.existsSync(MOVIES_DICT_PATH)) {
        console.error(`❌ moviesDict.json not found at: ${MOVIES_DICT_PATH}`);
        process.exit(1);
    }

    const moviesDict = JSON.parse(fs.readFileSync(MOVIES_DICT_PATH, "utf-8"));
    const toWatch = JSON.parse(fs.readFileSync(TO_WATCH_PATH, "utf-8"));
    const watched = JSON.parse(fs.readFileSync(WATCHED_PATH, "utf-8"));

    const imdbIds = Object.keys(moviesDict);
    console.log(`📦 Loaded ${imdbIds.length} movie metadata entries.`);

    console.log("📥 Inserting movie_details...");

    for (let imdbId of imdbIds) {
        const m = moviesDict[imdbId];

        const { error } = await supabase.from("movie_details").upsert(
            {
                imdb_id: imdbId,
                title: m.title,
                year: m.year,
                poster: m.poster,
                runtime: m.runtime || null,
                genres: Array.isArray(m.genres) ? m.genres : [],
                rating: m.rating || null,
                overview: m.overview || "",
            },
            { onConflict: "imdb_id" }
        );

        if (error) {
            console.error(`❌ Failed inserting metadata for ${imdbId}`, error);
            process.exit(1);
        }
    }

    console.log("✅ Metadata import complete.");

    console.log(`📥 Assigning movies to user ${SEED_USER_ID}...`);

    // Build final list with correct statuses
    let movieRows = [];

    movieRows.push(
        ...toWatch.map((m) => ({
            user_id: SEED_USER_ID,
            imdb_id: m.imdbId,
            status: "toWatch",
        }))
    );

    movieRows.push(
        ...watched.map((m) => ({
            user_id: SEED_USER_ID,
            imdb_id: m.imdbId,
            status: "watched",
        }))
    );

    console.log(`📦 Total movies for user: ${movieRows.length}`);

    // Insert in batches
    const batchSize = 300;
    for (let i = 0; i < movieRows.length; i += batchSize) {
        const chunk = movieRows.slice(i, i + batchSize);

        const { error } = await supabase.from("movies").insert(chunk);

        if (error) {
            console.error("❌ Batch insert failed:", error);
            console.log("Failed chunk:", chunk);
            process.exit(1);
        }

        console.log(`Inserted ${i + chunk.length} / ${movieRows.length}`);
    }

    console.log("🎉 Migration complete!");
    process.exit(0);
})();
