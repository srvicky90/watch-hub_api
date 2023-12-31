const mongoose = require("mongoose");
const uuid = require('uuid')
const friendshipSchema = new mongoose.Schema(
{
	friendshipId: {
        type: String,
        required: true,
        default: () => uuid.v4(),
        index: { unique: true},
    },
	sender: {
		type: String,
		required: true, 
		trim: true,
	},
    receiver: {
		type: String,
		required: true,
		trim: true,
	},
	status: {
		type: String,
		required: true,
		trim: true,
	}
},
{ timestamps: true }
);

const Friendship = mongoose.model("wh_friendships", friendshipSchema);
module.exports = Friendship;