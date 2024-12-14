const express = require("express");
const router = express.Router();
const controller = require("../controllers/recover.js");

router.get("/recover", controller.render);
router.get("/recover/:login/:token", controller.reset);

router.post("/recover", controller.request);
router.post("/recover/:login/:token", controller.update);

module.exports = router;
