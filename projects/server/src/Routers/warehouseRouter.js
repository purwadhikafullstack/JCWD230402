const express = require('express');
const { warehouseController } = require("../controllers");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { checkWarehouse } = require("../helpers/validator")

route.post("/", readToken, checkWarehouse, warehouseController.addNewWarehouse);
route.get("/", readToken, warehouseController.getWarehouse);
route.patch("/:uuid", readToken, warehouseController.updateWarehouse);
route.delete("/:uuid", readToken, warehouseController.deleteWarehouse);

module.exports = route;
