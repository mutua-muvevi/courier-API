const {
    postTransportation,
    getAllTransportation
} = require("../controllers/transportation");

const express = require("express");
const router = express.Router();

router.route("/getall").get(getAllTransportation);
router.route("/post").post(postTransportation);

module.exports = router