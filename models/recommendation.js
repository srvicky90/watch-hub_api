const mongoose = require("mongoose");
const uuid = require('uuid')
const schema = new mongoose.Schema(
{
	recommendationId: {
        type: String,
        required: true,
        default: () => uuid.v4(),
        index: { unique: true},
    },
	senderId: {
		type: String,
		required: true, 
		trim: true,
	},
    receiverId: {
		type: String,
		required: true,
		trim: true,
	},
    recommendationDate: {
		type: Date,
		required: true,
        default: Date.now,
		trim: true,
	},
    recommendationStatus: {
		type: String,
		required: true,
		trim: true,
	},
    movieId: {
		type: String,
		required: true,
		trim: true,
	}

},
{ timestamps: true }
);

const Friendship = mongoose.model("wh_recommendation", schema);
module.exports = Friendship;