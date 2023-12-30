const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
{
	userName: {
		type: String,
		required: true,
		trim: true,
	},
    firstName: {
		type: String,
		required: true,
		trim: true,
	},
    lastName: {
		type: String,
		required: true,
		trim: true,
	},
	emailAddress: {
		type: String,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	is_active: {
		type: Boolean,
		default: true,
	},
},
{ timestamps: true }
);

const User = mongoose.model("wh_users", userSchema);

module.exports = User;