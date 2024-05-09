const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema(
{
	movieId: {
        type: String,
        required: true,
        index: { unique: true},
    },
	movieName: {
		type: String,
		required: true, 
		trim: true,
	},
    movieYear: {
		type: String,
		required: true,
		trim: true,
	},
	movieLink: {
		type: String,
		required: true,
		trim: true,
	},
	movieType: {
		type: String,
		required: true,
		trim: true,
	}
},
{ timestamps: true }
);

const Movie = mongoose.model("wh_movies", movieSchema);
module.exports = Movie;