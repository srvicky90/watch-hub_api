const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  tmdbId: { type: Number, unique: true },
  title: String,
  overview: String,
  posterUrl: String,
  backdropUrl: String,
  releaseDate: String,
  rating: Number,
  voteCount: Number,
  popularity: Number,
  genres: [Number],
  language: String,
  runtime: Number,
  createdAt: { type: Date, default: Date.now },
  imdbId: { type: String, index: true },
  cast: [String],   // top 5 actors
  crew: [String],   // directors / writers
  hasImdb: { type: Boolean, default: null }
});

module.exports = mongoose.model("Movie", MovieSchema);
