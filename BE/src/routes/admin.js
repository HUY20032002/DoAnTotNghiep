const express = require("express");
const router = express.Router();
const AdminController = require("../app/controllers/AdminController");
const middlewareController = require("../app/controllers/MiddlewereController");

// Router cho user
router.get("/user/trash-manageruser", AdminController.trash_manageruser);
router.get("/user/manageruser", AdminController.manageruser);
router.delete("/user/:id/destroy", AdminController.destroyUser);
router.delete("/user/:id", AdminController.deleteUser);
router.put("/user/:id", AdminController.updateUser);
router.patch("/user/:id/restore", AdminController.restoreUser);
router.get("/user/:id/edit", AdminController.editUser);

module.exports = router;
