const express = require("express");
const router = express.Router();
const logged = require("../middlewares/logged.js");

router.get("/home", logged, (req, res) => {
	res.render("home");
});

module.exports = router;
