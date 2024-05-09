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
            $and: [
                { movieId: req.body.movie.movieId }
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
                recommendationStatus: 'active',
                movieId: req.body.movie.movieId,
                movieName: req.body.movie.movieName,
                movieYear: req.body.movie.movieYear,
                movieLink: req.body.movie.link,
                movieType: req.body.movie.type
            }
            );
            const isMovieAlreadyThere = await Movies.findOne({
                movieId: req.body.movie.movieId,
            })
            if (!isMovieAlreadyThere) {
                const newMovie = await Movies.create({
                    movieId: req.body.movie.movieId,
                    movieName: req.body.movie.movieName,
                    movieYear: req.body.movie.movieYear,
                    movieLink: req.body.movie.link,
                    movieType: req.body.movie.type
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
                return res.json(errorFunction(true, "Error recommending this movie. Please try again."));
            }

        }
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Error recommending movie."));
    }
};

const showRecommendations = async (req, res, next) => {
    console.log(req.body);
    try {
        const recommendations = await Recommendation.aggregate([
            {
                $match: {
                    $or: [
                        { recommendationStatus: 'active' },
                        { recommendationStatus: 'new' },
                        { recommendationStatus: 'liked' },
                    ],
                    $and: [
                        { receiverId: req.body.userId }
                    ]
                }
            },
            {
                $lookup: {
                    from: "wh_movies",
                    localField: "movieId",
                    foreignField: "movieId",
                    as: "movie"
                }
            }
        ]
            
        );
        console.log(recommendations);
        if (recommendations) {
            res.status(200);
            return res.json(errorFunction(false, "Recommendation list", recommendations ));
        } else {
            res.status(400);
            return res.json(errorFunction(false, "No recommendations yet."));
        }
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Error fetching recommendations. Please try again."));
    }
};

module.exports = {
    recommendMovie,
    showRecommendations
}