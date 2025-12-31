require("dotenv").config();
const axios = require("axios");
const { MongoClient } = require("mongodb");

const TMDB_KEY = "d858da79560433e2161dac18771fd38b";
const DB_NAME = "test";
const COLLECTION = "movies";

async function fetchCredits(tmdbId) {
    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
            {
                params: { api_key: TMDB_KEY },
            }
        );
        return res.data;
    } catch (err) {
        console.log(`❌ Failed fetching credits for ${tmdbId}`);
        return null;
    }
}

async function run() {
    const client = new MongoClient("mongodb+srv://srvignesh:MyMongodb$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority");
    await client.connect();
    const col = client.db(DB_NAME).collection(COLLECTION);
    console.log("✅ Connected to MongoDB");
    console.log(col)
    const movies = await col
        .find({
            $or: [
                { cast: { $exists: false } },
                { crew: { $exists: false } },
                { cast: { $size: 0 } },
                { crew: { $size: 0 } }
            ]
        })
        .project({ tmdbId: 1, title: 1 })
        .toArray();

    console.log(`🎯 Found ${movies.length} movies to update`);

    for (const movie of movies) {
        console.log(`➡ Updating: ${movie.title} (${movie.tmdbId})`);

        const credits = await fetchCredits(movie.tmdbId);
        if (!credits) continue;

        const cast = credits.cast?.map(c => ({
            id: c.id,
            name: c.name,
            character: c.character
        })) ?? [];

        const crew = credits.crew?.map(c => ({
            id: c.id,
            name: c.name,
            job: c.job
        })) ?? [];

        await col.updateOne(
            { tmdbId: movie.tmdbId },
            {
                $set: {
                    cast,
                    crew,
                    hasCast: cast.length > 0,
                    lastCreditsSync: new Date()
                }
            }
        );

        // avoid TMDB throttling (very important)
        await new Promise(r => setTimeout(r, 300));
    }

    console.log("✅ Done updating credits");
    await client.close();
}

run();