const express = require("express");
const { detailController } = require("../controllers");
const route = express.Router();

route.get("/product", detailController.getProduct);

module.exports = route;
