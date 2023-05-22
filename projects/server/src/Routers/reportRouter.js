const { reportController } = require("../controllers");
const express = require("express");
const { readToken } = require("../helpers/jwt");
const route = express.Router();

route.get("/summary", readToken, reportController.getSummary);
route.get("/all-stockmutation", readToken, reportController.getAllMutation);
route.get("/product-list", readToken, reportController.getProductList);

module.exports = route;
