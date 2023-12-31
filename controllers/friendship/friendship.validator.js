const joi = require("joi");
const errorFunction = require("../../utils/error_function");
const Joi = require("joi");

const validation = joi.object({
     sender: joi.string().min(3).max(50).trim(true).required(),
     receiver: joi.string().min(3).max(50).trim(true).required(),
     status: joi.string().valid("accepted", "declined", "pending").required()
});

const pendingRequestsValidation = joi.object({
    receiver: joi.string().min(3).max(50).trim(true).required(),
});

const respondRequestValidation = joi.object({
    friendshipId: joi.string().min(3).max(50).trim(true).required(),
	status: joi.string().valid("accepted", "declined").required()
});

const getFriendsValidation = joi.object({
    userId: joi.string().min(3).max(50).trim(true).required(),
});

const friendshipValidation = async (req, res, next) => {
	const payload = {
		sender: req.body.sender,
        receiver: req.body.receiver,
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
		receiver: req.body.receiver,
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
    console.log("User Id in validator " + req.body.Id);
	const payload = {
		userId: req.body.userId,
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