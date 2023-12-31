const joi = require("joi");
const errorFunction = require("../../utils/error_function");

const validation = joi.object({
	userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
	firstName: joi.string().min(2).max(25).trim(true).required(),
	lastName: joi.string().min(2).max(25).trim(true).required(),
	emailAddress: joi.string().email().trim(true).required(),
	password: joi.string().min(8).trim(true).required()
		.default([]),
	is_active: joi.boolean().default(true),
});

const loginFieldValidation = joi.object({
	userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
	password: joi.string().min(8).trim(true).required()
		.default([]),
	is_active: joi.boolean().default(true),
});

const getUserDetailsValidation = joi.object({
	userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
});

const searchUser = joi.object({
	searchString: joi.string().alphanum().min(3).max(50).trim(true).required(),
});

const userValidation = async (req, res, next) => {
	const payload = {
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		emailAddress: req.body.emailAddress,
		password: req.body.password,
		is_active: req.body.is_active,
	};
	console.log(payload);
	const { error } = validation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};

const loginValidation = async (req, res, next) => {
	const payload = {
		userName: req.body.userName,
		password: req.body.password,
	};
	console.log(payload);
	const { error } = loginFieldValidation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};

const getUserDetails = async (req, res, next) => {
	const payload = {
		userName: req.body.userName,
	};
	console.log(payload);
	const { error } = getUserDetailsValidation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};

const searchUsers = async (req, res, next) => {
	const payload = {
		searchString: req.body.searchString,
	};
	console.log(payload);
	const { error } = searchUser.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};

module.exports = {
	userValidation,
	loginValidation,
	getUserDetails,
	searchUsers
}