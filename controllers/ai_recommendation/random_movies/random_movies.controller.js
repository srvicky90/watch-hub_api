const { func } = require("joi");
const errorFunction = require("../../../utils/error_function");
const Movie = require("../../../models/ai_movie_schema");

const random_movies = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const match = { hasImdb: true };

        const movies = await Movie.aggregate([
            { $match: match },
            { $sample: { size: limit } }
        ]);
        res.json(errorFunction(false, 'Random Movies', movies));
    }

    catch (error) {
        console.log("error", error);
        res.status(403);
        return res.json(errorFunction(true, "Unable to fetch random movies"));
    };
}

module.exports = {
    random_movies
};