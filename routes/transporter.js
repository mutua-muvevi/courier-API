const express = require("express");
const router = express.Router();

const {
    transporterRegister,
    transporterLogin,
    transporterForgotPassword,
    transporterResetPassword
} = require("../controllers/transporter")

router.route("/register").post(transporterRegister)
router.route("/login").post(transporterLogin)
router.route("/forgotPassword").post(transporterForgotPassword);
router.route("/resetPassword/:resetToken").put(transporterResetPassword);



module.exports = router