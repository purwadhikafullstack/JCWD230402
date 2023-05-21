const { reportController } = require("../controllers");
const express = require("express");
const { readToken } = require("../helpers/jwt");
const route = express.Router();

route.get("/summary", readToken, reportController.getSummary);
route.get("/allstockmutation", readToken, reportController.getAllMutation);
route.get("/productlist", readToken, reportController.getProductList);

module.exports = route;
