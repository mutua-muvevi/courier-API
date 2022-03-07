const express = require("express");
const router = express.Router();
const {
    adminRegister,
    adminLogin,
    adminForgotPassword,
    adminResetPassword,
    getAllSenders,
    getAllVendors,
    getAllTransporters
} = require("../controllers/admin");

router.route("/register").post(adminRegister);
router.route("/login").post(adminLogin);
router.route("/forgotpassword").post(adminForgotPassword);
router.route("/resetpassword/:resetToken").put(adminResetPassword);


router.route("/getsenders").get(getAllSenders);
router.route("/getvendors").get(getAllVendors);
router.route("/gettransporters").get(getAllTransporters);

module.exports = router