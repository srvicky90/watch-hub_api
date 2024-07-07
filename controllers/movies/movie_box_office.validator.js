const joi = require("joi");
const errorFunction = require("../../utils/error_function");
const Joi = require("joi");

const boxOfficeValidation = joi.object({
    apiKey: joi.string().min(3).max(50).trim(true).required()
});

const getBoxOffice = async (req, res, next) => {
    const payload = {
        apiKey: req.body.apiKey
    };
    console.log(payload);
    const { error } = boxOfficeValidation.validate(payload);
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
    getBoxOffice
}