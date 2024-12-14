const express = require("express");
const router = express.Router();
const logged = require("../middlewares/logged.js");

router.get("/donate", logged, (req, res) => {
	res.render("donate/main");
});

module.exports = router;
