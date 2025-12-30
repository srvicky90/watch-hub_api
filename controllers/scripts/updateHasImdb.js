const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

TMDB_API_KEY="d858da79560433e2161dac18771fd38b"

const Movie = require("../../models/ai_movie_schema");

// const movieSchema = new mongoose.Schema(
//   {
//     imdb_id: String,
//     hasImdb: Boolean
//   },
//   { collection: "movies" }
// );
// const Movie = mongoose.model("Movie", movieSchema);

async function run() {
  try {
   mongoose.connect('mongodb+srv://srvignesh:MyMongodb$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority')
         .then(() => console.log('Successfully connected to the database. You are all set to go!!! '))
         .catch(err => console.error('Something went wrong', err));
    console.log("✅ MongoDB Connected");

    // hasImdb = true where imdb_id exists and not empty
    const updatedTrue = await Movie.updateMany(
      { imdbId: { $exists: true, $ne: "" } },
      { $set: { hasImdb: true } }
    );

    // hasImdb = false where imdb_id missing or empty
    const updatedFalse = await Movie.updateMany(
      { $or: [{ imdbId: { $exists: false } }, { imdbId: "" }] },
      { $set: { hasImdb: false } }
    );

    console.log(`Updated hasImdb = true → ${updatedTrue.modifiedCount}`);
    console.log(`Updated hasImdb = false → ${updatedFalse.modifiedCount}`);

    await mongoose.disconnect();
    console.log("Done and disconnected!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();