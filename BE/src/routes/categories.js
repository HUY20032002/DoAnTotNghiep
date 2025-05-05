const express = require("express");
const router = express.Router();
const CategoriesController = require("../app/controllers/CategoriesController");

// Router cho user
router.post("/", CategoriesController.store);
router.get("/all", CategoriesController.show);

module.exports = router;
