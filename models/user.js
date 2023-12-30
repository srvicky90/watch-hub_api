const mongoose = require("mongoose");
const uuid = require('uuid')
const userSchema = new mongoose.Schema(
{
	userName: {
		type: String,
		required: true,
		trim: true,
	},
	userId: {
        type: String,
        required: true,
        default: () => uuid.v4(),
        index: { unique: true},
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
	friends : {
		type: Array,
		default: [],
	}
},
{ timestamps: true }
);

const User = mongoose.model("wh_users", userSchema);

module.exports = User;