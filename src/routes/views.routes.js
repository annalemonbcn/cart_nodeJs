const express = require("express");
const router = express.Router();

// Products List view through handlebars
router.get("/", (req, res) => {
  res.render("home");
});

module.exports = router;
