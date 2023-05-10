const express = require("express");
const { stockMutationController } = require("../controllers");
const { readToken } = require('../helpers/jwt');
const route = express.Router();

route.get("/allproduct", readToken, stockMutationController.getProduct);
route.post("/warehouse", readToken, stockMutationController.getWarehouse);
route.post("/request", readToken, stockMutationController.requestStock);
route.get("/getrequest/:id", readToken, stockMutationController.getRequest);
route.get("/getsend/:id", readToken, stockMutationController.getSend);
route.patch("/acceptrequest/:id", readToken, stockMutationController.acceptRequest);
route.delete("/rejectrequest/:id", readToken, stockMutationController.rejectRequest);

module.exports = route;