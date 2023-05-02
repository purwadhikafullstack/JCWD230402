const { productController } = require("../controllers");
const express = require("express");
const { readToken } = require("../helpers/jwt");
const uploader = require("../helpers/uploader");
const route = express.Router();

route.post(
  "/",
  readToken,
  uploader("/ImgProduct", "PRO").array("images", 1),
  productController.addProduct
); //images itu harus sama dengan yang di formData FE
route.get("/", readToken, productController.getProduct);
route.get("/variant", readToken, productController.getVariant);
route.delete("/cart", readToken, productController.deleteAll);
route.delete("/:id", readToken, productController.deleteProduct);
route.patch(
  "/",
  readToken,
  uploader("/ImgProduct", "PRO").array("images", 1),
  productController.editProduct
);
route.patch("/variant/:id", readToken, productController.editVariant);
route.get("/price", readToken, productController.getPrice);
route.get("/color", readToken, productController.getColor);
route.post("/color", readToken, productController.addColor);
route.get("/memory", readToken, productController.getMemory);
route.post("/memory", readToken, productController.addMemory);

route.get("/customerproduct", productController.allProduct);
route.get("/oneproduct/", productController.oneProduct);
route.get("/colorproduct", productController.checkColor);
route.get("/memoryproduct", productController.checkMemory);
route.get("/priceproduct", productController.checkPrice);

route.post("/cart", readToken, productController.addToCart);
route.get("/cart", readToken, productController.getCart);
route.patch("/cart/:id", readToken, productController.deleteOneFromCart);
route.delete("/cart/", readToken, productController.deleteAll);
route.patch("/minuscart", readToken, productController.minusItem);
route.patch("/pluscart", readToken, productController.addItem);

module.exports = route;