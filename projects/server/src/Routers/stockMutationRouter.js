const express = require("express");
const { stockMutationController } = require("../controllers");
const { readToken } = require('../helpers/jwt');
const route = express.Router();

route.get("/all-product", readToken, stockMutationController.getProduct);
route.post("/warehouse", readToken, stockMutationController.getWarehouse);
route.post("/request", readToken, stockMutationController.requestStock);
route.get("/get-request", readToken, stockMutationController.getRequest);
route.get("/get-send", readToken, stockMutationController.getSend);
route.patch("/accept-request/:id", readToken, stockMutationController.acceptRequest);
route.delete("/reject-request/:id", readToken, stockMutationController.rejectRequest);

module.exports = route;