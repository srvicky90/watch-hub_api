const joi = require("joi");
const errorFunction = require("../../utils/error_function");
const Joi = require("joi");

const addRecommendationValidation = joi.object({
    senderId: joi.string().min(3).max(50).trim(true).required(),
    movie: joi.object().keys({
        movieId: joi.string().min(3).max(50).trim(true).required(),
        movieName: joi.string().min(1).max(200).trim(true).required(),
        movieYear: joi.string().min(1).max(5).trim(true).required(),
        movieLink: joi.string().min(1).max(700).trim(true).required(),
        movieType: joi.string().min(1).max(50).trim(true).required(),
    }),
    receiverId: joi.string().min(3).max(50).trim(true).required(),
    recommendationStatus: joi.string().valid("new","active", "ignored", "liked").required()
});

const ignoreRecommendationValidation = joi.object({
    senderId: joi.string().min(3).max(50).trim(true).required(),
    recommendationId: joi.string().min(3).max(50).trim(true).required(),
});


const ShowRecommendationsValidation = joi.object({
    userId: joi.string().min(3).max(50).trim(true).required(),
});


const addRecommendation = async (req, res, next) => {
    const moviePayload = {
        movieId: req.body.movie.movieId,
        movieName: req.body.movie.movieName,
        movieYear: req.body.movie.movieYear,
        movieLink: req.body.movie.movieLink,
        movieType: req.body.movie.movieType
    };
    const payload = {
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        recommendationStatus: req.body.recommendationStatus,
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

const ignoreRecommendation = async (req, res, next) => {
    const payload = {
        senderId: req.body.senderId,
        recommendationId: req.body.recommendationId
    };
    console.log(payload);
    const { error } = ignoreRecommendationValidation.validate(payload);
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

const showRecommendations = async (req, res, next) => {
    const payload = {
        userId: req.body.userId
    };
    console.log(payload);
    const { error } = ShowRecommendationsValidation.validate(payload);
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
    addRecommendation,
    showRecommendations,
    ignoreRecommendation
}