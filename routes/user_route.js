const express = require("express");

const userValidation = require("../controllers/user/user.validator");
const { addUser, loginUser, getUserDetails, searchUsers } = require("../controllers/user/user.controller");

const friendshipValidation = require("../controllers/friendship/friendship.validator");
const { createPendingFriendReq, getPendingRequests, respondRequest, getFriends  } = require("../controllers/friendship/friendship.controller");

const defaultController = require("../controllers/default_controller");

const router = express.Router();

router.get("/", defaultController);
router.post("/addUser", userValidation.userValidation, addUser);
router.post("/login", userValidation.loginValidation, loginUser);
router.post("/getUserDetails", userValidation.getUserDetails, getUserDetails);
router.post("/searchUser", userValidation.searchUsers, searchUsers);

router.post("/sendFriendRequest", friendshipValidation.friendshipValidation, createPendingFriendReq);
router.post("/friendRequests", friendshipValidation.friendRequests, getPendingRequests);
router.post("/respondFriendRequest", friendshipValidation.respondRequest, respondRequest);
router.post("/getFriends", friendshipValidation.getFriends, getFriends);

module.exports = router;