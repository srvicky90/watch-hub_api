const express = require("express");

const userValidation = require("../controllers/user/user.validator");
const { addUser, loginUser, getUserDetails, searchUsers, deleteUserAccount, forgotPassword, changePassword } = require("../controllers/user/user.controller");

const friendshipValidation = require("../controllers/friendship/friendship.validator");
const { createPendingFriendReq, getPendingRequests, respondRequest, getFriends  } = require("../controllers/friendship/friendship.controller");

const reccomendationValidation = require("../controllers/recommendation/recommendation.validator");
const { recommendMovie, showRecommendations, ignoreRecommendedMovie } = require("../controllers/recommendation/recommendation.controller");

const defaultController = require("../controllers/default_controller");

const router = express.Router();

router.get("/", defaultController);
router.post("/addUser", userValidation.userValidation, addUser);
router.post("/login", userValidation.loginValidation, loginUser);
router.post("/getUserDetails", userValidation.getUserDetails, getUserDetails);
router.post("/searchUser", userValidation.searchUsers, searchUsers);
router.post("/deleteUser", userValidation.deleteUserAccount, deleteUserAccount);
router.post("/sendOTP", userValidation.forgotPassword, forgotPassword);
router.post("/changePassword", userValidation.changePassword, changePassword);

router.post("/sendFriendRequest", friendshipValidation.friendshipValidation, createPendingFriendReq);
router.post("/friendRequests", friendshipValidation.friendRequests, getPendingRequests);
router.post("/respondFriendRequest", friendshipValidation.respondRequest, respondRequest);
router.post("/getFriends", friendshipValidation.getFriends, getFriends);

router.post("/recommendMovie", reccomendationValidation.addRecommendation, recommendMovie);
router.post("/showRecommendations", reccomendationValidation.showRecommendations, showRecommendations);
router.post("/ignoreRecommendation", reccomendationValidation.ignoreRecommendation, ignoreRecommendedMovie);

module.exports = router;