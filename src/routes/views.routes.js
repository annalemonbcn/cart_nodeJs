import { Router } from "express";

const router = Router();

// Products List view through handlebars
router.get("/", (req, res) => {
  res.render("home");
});

export default router;
