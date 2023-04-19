const { productController } = require("../controllers");
const express = require("express");
const { readToken } = require("../helpers/jwt");
const route = express.Router();

route.get("/", productController.allProduct);
route.get("/oneproduct/", productController.oneProduct);
route.get("/color", productController.checkColor);
route.get("/memory", productController.checkMemory);
route.get("/price", productController.checkPrice);
route.post("/cart", readToken, productController.addToCart);
route.get("/cart", readToken, productController.getCart);

module.exports = route;
