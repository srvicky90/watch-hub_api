const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const Movie = require("../../models/ai_movie_schema");
const TMDB_BASE = "https://api.themoviedb.org/3";

TMDB_API_KEY="d858da79560433e2161dac18771fd38b"
console.log("Hello, World!");

async function connectDB() {
    mongoose.connect('mongodb+srv://srvignesh:MyMongodb$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority')
        .then(() => console.log('Successfully connected to the database. You are all set to go!!! '))
        .catch(err => console.error('Something went wrong', err));
    console.log("✅ MongoDB Connected");
}

async function fetchMovies(page) {
  const url = `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  const res = await axios.get(url);
  return res.data.results || [];
}

async function seed() {
  await connectDB();

  const TOTAL_PAGES = 500;   // You can increase later (max 500)

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`📥 Fetching Page ${page}`);

    const movies = await fetchMovies(page);

    const docs = movies
      .filter(m => m.poster_path) // skip garbage data
      .map(m => ({
        tmdbId: m.id,
        title: m.title,
        overview: m.overview,
        posterUrl: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        backdropUrl: m.backdrop_path
          ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
          : null,
        releaseDate: m.release_date,
        rating: m.vote_average,
        voteCount: m.vote_count,
        popularity: m.popularity,
        genres: m.genre_ids,
        language: m.original_language,
        createdAt: new Date()
      }));

    await Movie.bulkWrite(
      docs.map(doc => ({
        updateOne: {
          filter: { tmdbId: doc.tmdbId },
          update: doc,
          upsert: true
        }
      }))
    );

    console.log(`✅ Inserted / Updated ${docs.length} movies (Page ${page})`);
  }

  console.log("🎉 Seeding Completed");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

