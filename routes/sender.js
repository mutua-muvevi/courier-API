const express = require("express");
const router = express.Router();
const { 
	senderRegister,
	senderLogin,
	senderForgotPassword,
	senderResetPassword
} = require("../controllers/sender");

// register route
router.route("/register").post(senderRegister);
router.route("/login").post(senderLogin);
router.route("/forgotpassword").post(senderForgotPassword);
router.route("/resetpassword/:resetToken").put(senderResetPassword);

module.exports = router