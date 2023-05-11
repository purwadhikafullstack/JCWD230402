const express = require("express");
const { orderController } = require("../controllers");
const route = express.Router();
const { readToken } = require("../helpers/jwt");
const uploader = require("../helpers/uploader");

route.post("/", readToken, orderController.createOrder);
route.get("/customerorder", readToken, orderController.myOrder);
route.get("/oneorder", readToken, orderController.oneOrder);
route.patch(
  "/payment",
  readToken,
  uploader("/PaymentProof", "PAY").array("images", 1),
  orderController.payment
);

module.exports = route;
