const express = require("express");
const router = express.Router()
const { senderRegister } = require("../controllers/sender");

// register route
router.route("/register").post(senderRegister);

module.exports = router