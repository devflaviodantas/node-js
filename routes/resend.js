const express = require("express");
const router = express.Router();
const controller = require("../controllers/resend.js");

router.get("/resend", controller.render);
router.post("/resend", controller.resend);

module.exports = router;
