const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController");
const middlewareController = require("../app/controllers/MiddlewereController");
// console.log(newsController.index);
router.get("/login", siteController.login);
router.get("/register", siteController.register);
router.get("/:slug", siteController.search);
router.get("/", siteController.index);
router.post("/forgotpassword", siteController.forgotPassword);

router.post("/logout", middlewareController.verifyToken, siteController.index);
module.exports = router;
