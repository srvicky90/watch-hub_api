require("dotenv").config();
const axios = require("axios");
const { MongoClient } = require("mongodb");

const TMDB_KEY = "d858da79560433e2161dac18771fd38b";
const MONGO_URI = "mongodb+srv://srvignesh:MyMongodb$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "test";
const COLLECTION = "movies";

async function run() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const col = client.db(DB_NAME).collection(COLLECTION);

    const movies = await col.find({
        $or: [
            { castStructured: { $exists: false } },
            { crewStructured: { $exists: false } }
        ]
    }).project({ tmdbId: 1, title: 1 }).toArray();

    console.log(`🎯 Updating ${movies.length} movies with structured credits`);

    for (const movie of movies) {
        console.log(`➡ Fetching credits: ${movie.title}`);

        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits`,
                { params: { api_key: TMDB_KEY } }
            );

            if (!data) {
                console.log(`⚠️ No credits object for ${movie.title} (${movie.tmdbId})`);
                continue;
            }

            // ---------- CAST ----------
            const castMap = new Map();
            (data.cast || []).forEach(c => {
                if (!c?.name) return;
                if (!castMap.has(c.name)) {
                    castMap.set(c.name, {
                        id: c.id || null,
                        name: c.name,
                        character: c.character || null
                    });
                }
            });
            const cast = Array.from(castMap.values());

            // ---------- CREW ----------
            const crewMap = new Map();
            (data.crew || []).forEach(c => {
                if (!c?.name) return;
                if (!crewMap.has(c.name)) {
                    crewMap.set(c.name, {
                        id: c.id || null,
                        name: c.name,
                        job: c.job || null
                    });
                }
            });
            const crew = Array.from(crewMap.values());

            // ---------- UPDATE ----------
            await col.updateOne(
                { tmdbId: movie.tmdbId },
                {
                    $set: {
                        castStructured: cast,
                        crewStructured: crew,
                        hasCast: cast.length > 0,
                        hasCrew: crew.length > 0,
                        lastCreditsSync: new Date()
                    }
                }
            );
        } catch (e) {
            console.log(`❌ Failed for ${movie.title} (${movie.tmdbId}): ${e.message}`);
        }

        await new Promise(r => setTimeout(r, 600));
    }

    console.log("✅ Structured credits migration completed");
    await client.close();
}

run();