const express = require("express");
const router = express.Router();
const AuthController = require("../app/controllers/AuthController");
const MiddlewareController = require("../app/controllers/MiddlewereController");

// console.log(newsController.index);

router.post("/register", AuthController.register);
router.post("/login", AuthController.login.bind(AuthController));
router.post("/logout", MiddlewareController.verifyToken, AuthController.logout);
router.get("/:id/edit", AuthController.edit);
router.put("/:id", AuthController.update);
router.post("/refresh", AuthController.RequestrefreshToken);

module.exports = router;
