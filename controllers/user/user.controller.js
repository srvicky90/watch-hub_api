const User = require("../../models/user");
const errorFunction = require("../../utils/error_function");
const securePassword = require("./../../utils/secure_password");

const addUser = async (req, res, next) => {
	try {
		const existingUser = await User.findOne({
			userName: req.body.userName,
		}).lean(true);
		const isExistingEmail = await User.findOne({
			userName: req.body.emailAddress,
		}).lean(true);
		console.log(isExistingEmail);
		if (isExistingEmail) {
			res.status(403);
			return res.json(errorFunction(true, "Email ID is Already Registered"));
		} else if (existingUser) {
			res.status(403);
			return res.json(errorFunction(true, "Username is Already Registered. Please use a different username."));
		} else {
			const hashedPassword = await securePassword(req.body.password);
			const newUser = await User.create({
				userName: req.body.userName,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				emailAddress: req.body.emailAddress,
				password: hashedPassword,
				is_active: req.body.is_active,
			});
			if (newUser) {
				res.status(201);
				return res.json(
					errorFunction(false, "User Created", newUser)
				);
			} else {
				res.status(403);
				return res.json(errorFunction(true, "Error Creating User"));
			}
		}
	} catch (error) {
		res.status(400);
		console.log(error);
		return res.json(errorFunction(true, "Error Adding user"));
	}
};

module.exports = {
	addUser
}