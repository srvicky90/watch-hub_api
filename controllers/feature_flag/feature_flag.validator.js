const joi = require("joi");
const error_function = require("../../utils/error_function");

const ff_validation = joi.object({});

const featureFlagValidation = async (req, res, next) => {
    const { error } = ff_validation.validate(req.body);
    if (error) {
        res.status(406);
        return res.json(
            error_function(true, `Error in Feature Flag Data: ${error.message}`)
        );
    } else {
        next();
    }
}

module.exports = {
    featureFlagValidation
};