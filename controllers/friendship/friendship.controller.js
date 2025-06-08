const { func } = require("joi");
const Friendship = require("../../models/friends");
const Authentication = require("../../models/user");
const errorFunction = require("../../utils/error_function");

const createPendingFriendReq = async (req, res, next) => {
    try {
        const alreadyFriend = await Friendship.findOne({
            $or: [
                { sender: req.body.sender, receiver: req.body.receiver },
                { sender: req.body.receiver, receiver: req.body.sender }
            ],
            status: 'accepted' // Assuming 'accepted' is the status for a confirmed friendship
        });
        const alreadyRequestSent = await Friendship.findOne({
            $or: [
                { sender: req.body.sender, receiver: req.body.receiver },
                { sender: req.body.receiver, receiver: req.body.sender }
            ],
            status: 'pending' 
        });
        if (alreadyFriend) {
            res.status(403);
            return res.json(errorFunction(true, "You are already friends."));
        } else if (alreadyRequestSent) {
            res.status(403);
            return res.json(errorFunction(true, "There's a pending request already."));
        } else {
            const newFriend = await Friendship.create({
                sender: req.body.sender,
                receiver: req.body.receiver,
                status: 'pending'
            }
            );
            if (newFriend) {
                res.status(201);
                return res.json(
                    errorFunction(false, "Friend request sent.", newFriend)
                );
            } else {
                res.status(403);
                return res.json(errorFunction(true, "Error Sending Friend Request"));
            }
        }
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Error Sending Friend Request"));
    }
};

const getPendingRequests = async (req, res, next) => {
    try {
        const userFriends = await Friendship.aggregate([
            {
                $match: {
                    $or: [{ receiver: req.body.receiver }],
                    status: "pending"
                }
            },
            {
                $lookup: {
                    from: "wh_users",
                    let: {
                        friendId: {
                            $cond: [
                                { $eq: ["$sender", req.body.receiver] },
                                "$receiver",
                                "$sender"
                            ]
                        }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$friendId", "$userId"] }
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                emailAddress: 1
                            }
                        }
                    ],
                    as: "friends"
                }
            }
        ])
        res.status(201);
        return res.json(
            errorFunction(false, "Pending Friends Requests", userFriends)
        );
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Failed to fetch the pending requests list."));
    }
};

const respondRequest = async (req, res, next) => {
    try {
        friendship = Friendship;
        console.log("Friendship Id in controller " + req.body.friendshipId)
        if (req.body.status == "unfriended") {
            friendship = await Friendship.deleteOne(
                { $or: [{ friendshipId: req.body.friendshipId }] },
            )
        } else {
            friendship = await Friendship.findOneAndUpdate(
                { $or: [{ friendshipId: req.body.friendshipId }] },
                { $set: { status: req.body.status } }
            );
        }
        console.log(friendship);
        if (friendship) {
            res.status(201);
            switch (req.body.status) {
                case "accepted":
                    return res.json(
                        errorFunction(false, "You now have a new friend.", friendship)
                    );
                    break;
                case "blocked":
                    return res.json(
                        errorFunction(false, "The user is blocked. You can't receive any recommendations from the user.", friendship)
                    );
                    break;
                case "unfriended":
                    return res.json(
                        errorFunction(false, "The user has been unfriended. You can still add him as a friend. ", friendship)
                    );
                    break;
                default:
                    return res.json(
                        errorFunction(false, "Declined the request successfully.", friendship)
                    );
                    break;
            }
        } else {
            res.status(400);
            return res.json(
                errorFunction(true, "Unable to accept the friend request.", friendship)
            );
        }
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Failed to fetch the pending friend requests"));
    }
};


const getFriends = async (req, res, next) => {
    try {
        const userFriends = await Friendship.aggregate([
            {
                $match: {
                    $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
                    status: "accepted" // Consider only accepted friendships
                }
            },
            {
                $lookup: {
                    from: "wh_users",
                    let: {
                        friendId: {
                            $cond: [
                                { $eq: ["$sender", req.body.userId] },
                                "$receiver",
                                "$sender"
                            ]
                        }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$friendId", "$userId"] }
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                emailAddress: 1
                            }
                        }
                    ],
                    as: "friends"
                }
            }
        ])
        res.status(201);
        return res.json(
            errorFunction(false, "Friends List", userFriends)
        );
    } catch (error) {
        res.status(400);
        console.log(error);
        return res.json(errorFunction(true, "Failed to fetch the friends list."));
    }
};




module.exports = {
    createPendingFriendReq,
    getPendingRequests,
    respondRequest,
    getFriends
}