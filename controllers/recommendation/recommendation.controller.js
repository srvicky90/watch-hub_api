const { func, not } = require("joi");
const Recommendation = require("../../models/recommendation");
const Movies = require("../../models/movie");
const errorFunction = require("../../utils/error_function");

const recommendMovie = async (req, res, next) => {
    console.log(req.body);
    try {
        const alreadyRecommended = await Recommendation.findOne({
            $or: [
                { senderId: req.body.senderId, receiverId: req.body.receiverId },
                { senderId: req.body.receiverId, receiverId: req.body.senderId }
            ],
            recommendationStatus: 'active'
        });
        console.log(alreadyRecommended);
        if (alreadyRecommended) {
            res.status(403);
            return res.json(errorFunction(true, "This movie is already recommended."));
        } else {
            const newRecommendation = await Recommendation.create({
                senderId: req.body.senderId,
                receiverId: req.body.receiverId,
                recommendationStatus: 'active'
            }
            );
            const isMovieAlreadyThere = await Movies.findOne({
                movieId: req.body.movie.movieId,
            })
            if (!isMovieAlreadyThere) {
                const newMovie = await Movies.create({
                    movieId: req.body.movie.movieId,
                    movieName: req.body.movie.movieName,
                    genre: req.body.movie.movieGenre
                }
                );
            }
                if (newRecommendation) {
                    res.status(201);
                    return res.json(
                        errorFunction(false, "Recommendation Sent.", newRecommendation)
                    );
                } else {
                    res.status(400);
                    console.log(error);
                    return res.json(errorFunction(true, "Error Recommending this movie. Please try again."));
                }
            
        }
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Error Sending Friend Request"));
    }
};

module.exports = {
    recommendMovie
}