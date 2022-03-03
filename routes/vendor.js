const express = require("express");
const router = express.Router();

const {
    vendorRegistration,
    vendorLogin,
    vendorForgotPassword,
    vendorResetPassword
} = require("../controllers/vendor");

router.route("/register").post(vendorRegistration);
router.route("/login").post(vendorLogin);
router.route("/forgotPassword").post(vendorForgotPassword);
router.route("/resetPassword/:resetToken").put(vendorResetPassword);

module.exports = router;