const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    ratingValue: { type: Number, required: true },
    ratingCount: { type: Number, required: true }
  });

  const movieDetailSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    image: { type: String, required: true },
    movieId: { type: String, required: true },
    rating: { type: ratingSchema, required: true }
  });

  const boxOfficeSchema = new mongoose.Schema({
    timeRange: { type: String, required: true },
    movies: { type: [movieDetailSchema], required: true }
  });
  
  const BoxOffice = mongoose.model("wh_box_office", boxOfficeSchema);
  module.exports = BoxOffice;