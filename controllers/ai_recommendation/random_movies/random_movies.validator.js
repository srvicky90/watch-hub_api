const joi = require("joi");
const error_function = require("../../../utils/error_function");

const random_validation = joi.object({});

const ai_random_movies_validation = async (req, res, next) => {
    const { error } = random_validation.validate(req.body);
    if (error) {
        res.status(406);
        return res.json(
            error_function(true, `Error in Random Movies Data: ${error.message}`)
        );
    } else {
        next();
    }
}

module.exports = {
    ai_random_movies_validation
};

