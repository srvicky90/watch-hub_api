const { func, not } = require("joi");
const BoxOffice = require("../../models/movie_box_office");
const errorFunction = require("../../utils/error_function");

const getBoxOfficeMovie = async (req, res, next) => {
    try {
        if (req.body.apiKey == "watchhubapikey") {
            const movies = await BoxOffice.find();
            console.log(movies);
            res.status(200);
            return res.json(errorFunction(false, "Movies", movies));
        } else {
            res.status(404);
            return res.json(errorFunction(true, "Invalid API Key. Please contact reach.watchhub@gmail.com", []));
        }

    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Error fetching top box office movies. Please try again."));
    }
};

module.exports = {
    getBoxOfficeMovie
}