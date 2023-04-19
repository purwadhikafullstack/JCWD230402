const { productController } = require("../controllers");
const express = require("express");
const { readToken } = require("../helpers/jwt");
const uploader = require("../helpers/uploader");
const route = express.Router();

route.get("/customerproduct", productController.allProduct);
route.get("/oneproduct/", productController.oneProduct);
route.get("/colorproduct", productController.checkColor);
route.get("/memoryproduct", productController.checkMemory);
route.get("/priceproduct", productController.checkPrice);
route.post("/cart", readToken, productController.addToCart);
route.get("/cart", readToken, productController.getCart);

module.exports = route;
