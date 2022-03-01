const express = require("express");
const router = express.Router()
const { 
	senderRegister,
	senderLogin
} = require("../controllers/sender");

// register route
router.route("/register").post(senderRegister);
router.route("/login").post(senderLogin)

module.exports = router