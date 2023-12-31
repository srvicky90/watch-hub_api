const bcrypt = require("bcryptjs");
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

const loginUser = async (req, res, next) => {
	console.log('Username', req.body.userName);
	console.log('Password', req.body.password);
	try {
		const existingUser = await User.findOne({
			userName: req.body.userName,
		}).lean(true);
		if (existingUser) {
			res.status(201);
			console.log("DB retrieved " + existingUser.password);
			const userHashPassword = await securePassword(req.body.password);
			console.log("User Entered hashed password " + userHashPassword);

			if (await bcrypt.compare(req.body.password, existingUser.password)) {
				console.log("Password verified");
				res.status(200);
				return res.json(
					errorFunction(false, "Valid Credentials.", existingUser)
				);
			} else {
				console.log("Password not verified");
				return res.status(401).json({
					status: "failed",
					data: [],
					message:
						"You've entered wrong credentials. Please retry.",
				});
			}
		} else {
			res.status(401);
			return res.json(
				errorFunction(true, "User Not found. Please register.")
			);
		}
	} catch (error) {
		res.status(400);
		console.log(error);
		return res.json(errorFunction(true, "You've entered wrong credentials. Please retry."));
	}
}

const getUserDetails = async (req, res, next) => {
	console.log('Username', req.body.userName);
	try {
		const existingUser = await User.findOne({
			userName: req.body.userName,
		}).lean(true);
		if (existingUser) {
			res.status(201);
			console.log("User Found with details");
			res.status(200);
			return res.json(
				errorFunction(false, "User Details found", existingUser)
			);
		} else {
			res.status(400);
			return res.json(
				errorFunction(false, "User Not found")
			);
		}
	} catch (error) {
		res.status(400);
		console.log(error);
		return res.json(errorFunction(true, "User Not found."));
	}
}

const searchUsers = async (req, res, next) => {
	console.log('searchString', req.body.searchString);
	try {
		const searchPattern = new RegExp(req.body.searchString, 'i');
		// Perform the search across multiple fields
		const users = await User.find({
			$or: [
				{ userName: searchPattern },
				{ firstName: searchPattern },
				{ emailAddress: searchPattern },
				{ lastName: searchPattern }
			]
		});
		if (users.length == 0) {
			res.status(200);
			return res.json(
				errorFunction(false, "No users matches your search", users)
			);
		} else if (users.length > 0) {
			res.status(200);
			return res.json(
				errorFunction(false, "Search List", users)
			);
		} else {
			res.status(400);
			return res.json(
				errorFunction(false, "No users matches your search")
			);
		}
	} catch (error) {
		res.status(400);
		console.log(error);
		return res.json(errorFunction(true, "No users matches your search"));
	}
}

const deleteUserAccount = async (req, res, next) => {
	console.log('user id', req.body.userId);
	try {
		const user = await User.findOneAndDelete({
			$or: [
				{ userId: req.body.userId },
			]
		}).lean(true);
		if (user) {
			res.status(200);
			return res.json(
				errorFunction(false, "User deleted", user)
			);
		} else {
			res.status(200);
			return res.json(
				errorFunction(false, "No user found. unable to delete")
			);
		}
	} catch (error) {
		res.status(400);
		console.log(error);
		return res.json(
			errorFunction(true, "No user found. unable to delete")
		);
	}
}

module.exports = {
	addUser,
	loginUser,
	getUserDetails,
	searchUsers,
	deleteUserAccount
}