const {postvehicles} = require("../controllers/vehicle");
const express = require("express");
const router = express.Router();

router.route("/post").post(postvehicles);

module.exports = router