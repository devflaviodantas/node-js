const express = require("express");
const router = express.Router();
const { logger } = require("../utils/logger.js");

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			logger("error", "Error during session destruction", err);
			return res.redirect("/home");
		}
		res.redirect("/login");
	});
});

module.exports = router;
