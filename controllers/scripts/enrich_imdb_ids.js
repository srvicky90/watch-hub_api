const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

TMDB_API_KEY="d858da79560433e2161dac18771fd38b"

const Movie = require("../../models/ai_movie_schema");

const TMDB_BASE = "https://api.themoviedb.org/3";

async function connectDB() {
  mongoose.connect('mongodb+srv://srvignesh:MyMongodb$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority')
         .then(() => console.log('Successfully connected to the database. You are all set to go!!! '))
         .catch(err => console.error('Something went wrong', err));
     console.log("✅ MongoDB Connected");
}

async function fetchExternalIds(tmdbId) {
  const url = `${TMDB_BASE}/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
  const res = await axios.get(url);
  return res.data.imdb_id || null;
}

async function fetchCredits(tmdbId) {
  const url = `${TMDB_BASE}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`;
  const res = await axios.get(url);

  const cast = res.data.cast || [];
  const crew = res.data.crew || [];

  // Top 5 cast members
  const castNames = cast.slice(0, 5).map(c => c.name);

  // Directors and writers
  const crewNames = crew
    .filter(c => ["Director", "Writer", "Screenplay"].includes(c.job))
    .map(c => c.name);

  return { castNames, crewNames };
}

async function enrich_cast() {
  await connectDB();

  const movies = await Movie.find({ hasImdb: false, $or: [{ cast: { $exists: false } }, { crew: { $exists: false } }] }).limit(5000);
  console.log(`🎬 Movies to enrich: ${movies.length}`);

  for (const m of movies) {
    try {
      const { castNames, crewNames } = await fetchCredits(m.tmdbId);

      await Movie.updateOne(
        { _id: m._id },
        { $set: { cast: castNames, crew: crewNames } }
      );

      console.log(`✔ ${m.title} updated: ${castNames.length} cast, ${crewNames.length} crew`);

      // avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`❌ Failed for ${m.title}`, err.message);
    }
  }

  console.log("🎉 Cast & crew enrichment complete");
  process.exit();
}

async function enrich() {
  await connectDB();

  const movies = await Movie.find({ imdbId: { $exists: false } }).limit(5000);
  console.log(`🎬 Movies missing IMDb ID: ${movies.length}`);

  let count = 0;

  for (const m of movies) {
    try {
      const imdbId = await fetchExternalIds(m.tmdbId);

      if (imdbId) {
        await Movie.updateOne(
          { _id: m._id },
          { $set: { imdbId } }
        );
        console.log(`✔ Updated ${m.title} -> ${imdbId}`);
      } else {
        console.log(`⚠ No IMDb for ${m.title}`);
      }

      count++;

      // avoid API rate limit
      await new Promise(res => setTimeout(res, 150));

    } catch (err) {
      console.log(`❌ Failed for ${m.tmdbId}`, err.message);
    }
  }

  console.log("🎉 Done updating IMDb IDs");
  process.exit();
}

// enrich();
enrich_cast();


