const express = require('express');
const { warehouseController } = require("../controllers")
const route = express.Router();

route.post("/", warehouseController.addNewWarehouse);
route.get("/", warehouseController.getWarehouse);
route.patch("/", warehouseController.updateWarehouse);

module.exports = route;