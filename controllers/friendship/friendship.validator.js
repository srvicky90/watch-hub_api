const joi = require("joi");
const errorFunction = require("../../utils/error_function");
const Joi = require("joi");

const validation = joi.object({
     userName1: joi.string().alphanum().min(3).max(25).trim(true).required(),
     userName2: joi.string().alphanum().min(3).max(25).trim(true).required(),
     status: joi.string().valid("accepted", "declined", "pending").required()
});

const pendingRequestsValidation = joi.object({
    userName2: joi.string().alphanum().min(3).max(25).trim(true).required(),
});

const respondRequestValidation = joi.object({
    friendshipId: joi.string().min(3).max(50).trim(true).required(),
	status: joi.string().valid("accepted", "declined").required()
});

const getFriendsValidation = joi.object({
    userName: joi.string().min(3).max(50).trim(true).required(),
});

const friendshipValidation = async (req, res, next) => {
	const payload = {
		userName1: req.body.userName1,
        userName2: req.body.userName2,
        status: req.body.status,
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

const friendRequests = async (req, res, next) => {
	const payload = {
		userName2: req.body.userName2,
	};
	console.log(payload);
	const { error } = pendingRequestsValidation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};

const respondRequest = async (req, res, next) => {
    console.log("Friendship Id in validator " + req.body.friendshipId);
	console.log("Status in validator " + req.body.status);
	const payload = {
		friendshipId: req.body.friendshipId,
		status: req.body.status
	};
	const { error } = respondRequestValidation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};

const getFriends = async (req, res, next) => {
    console.log("User Id in validator " + req.body.userName);
	const payload = {
		userName: req.body.userName,
	};
	const { error } = getFriendsValidation.validate(payload);
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
    friendshipValidation,
    friendRequests,
    respondRequest,
	getFriends
}