const express = require("express");
const { orderController } = require("../controllers");
const route = express.Router();
const { readToken } = require("../helpers/jwt");
const uploader = require("../helpers/uploader");

route.post("/", readToken, orderController.createOrder);
route.get("/customer-order", readToken, orderController.myOrder);
route.get("/one-order", readToken, orderController.oneOrder);
route.patch("/payment", readToken, uploader("/PaymentProof", "PAY").array("images", 1), orderController.payment);
route.get("/", readToken, orderController.customerOrder);
route.get("/all-order", readToken, orderController.getAllCustomerOrder);
route.get("/order-details/:uuid", readToken, orderController.customerOrderDetails);
route.patch("/payment-confirmation", readToken, orderController.paymentConfirmation);
route.patch("/payment-rejection", readToken, orderController.paymentRejection);
route.post("/send-product", readToken, orderController.sendProduct);

module.exports = route;
