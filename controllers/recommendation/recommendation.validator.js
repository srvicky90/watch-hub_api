const joi = require("joi");
const errorFunction = require("../../utils/error_function");
const Joi = require("joi");

const addRecommendationValidation = joi.object({
    senderId: joi.string().min(3).max(50).trim(true).required(),
    movie: joi.object().keys({
        movieId: joi.string().min(3).max(50).trim(true).required(),
        movieName: joi.string().min(1).max(200).trim(true).required(),
        movieGenre: joi.string().min(1).max(50).trim(true).required(),
    }),
    receiverId: joi.string().min(3).max(50).trim(true).required(),
    status: joi.string().valid("active", "revoked", "liked").required()
});

const addRecommendation = async (req, res, next) => {
    const moviePayload = {
        movieId: req.body.movie.movieId,
        movieName: req.body.movie.movieName,
        movieGenre: req.body.movie.movieGenre,
    };
    const payload = {
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        status: req.body.status,
        movie: moviePayload
    };
    console.log(payload);
    const { error } = addRecommendationValidation.validate(payload);
    if (error) {
        console.log(error);
        res.status(406);
        return res.json(
            errorFunction(true, `Error in User Data : ${error.message}`)
        );
    } else {
        next();
    }
};

module.exports = {
    addRecommendation
}