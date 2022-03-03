const express = require("express");
const router = express.Router();

const {
    vendorRegistration,
    vendorLogin
} = require("../controllers/vendor");

router.route("/register").post(vendorRegistration),
router.route("/login").post(vendorLogin),

module.exports = router;