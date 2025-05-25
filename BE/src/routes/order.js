const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/OrderController");

// Router cho user
router.post("/create", OrderController.createOrder);

module.exports = router;
