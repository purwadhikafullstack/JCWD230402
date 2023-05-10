const express = require("express");
const { orderController } = require("../controllers");
const route = express.Router();
const { readToken } = require("../helpers/jwt");

route.post("/", readToken, orderController.createOrder);
route.get("/customerorder", readToken, orderController.myOrder);
route.get("/oneorder", readToken, orderController.oneOrder);

module.exports = route;
