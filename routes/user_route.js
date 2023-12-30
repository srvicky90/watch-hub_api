const express = require("express");

const userValidation = require("../controllers/user/user.validator");
const { addUser } = require("../controllers/user/user.controller");

const defaultController = require("../controllers/default_controller");

const router = express.Router();

router.get("/", defaultController);
router.post("/addUser", userValidation, addUser);


module.exports = router;