const express = require("express");
const router = express.Router();
const {
    adminRegister,
    adminLogin,
    adminForgotPassword,
    adminResetPassword
} = require("../controllers/admin");

router.route("/register").post(adminRegister);
router.route("/login").post(adminLogin);
router.route("/forgotpassword").post(adminForgotPassword);
router.route("/resetpassword/:resetToken").put(adminResetPassword);

module.exports = router