const express = require("express");
const { rajaongkirController } = require("../controllers");
const route = express.Router();

route.get("/province", rajaongkirController.getProvince);
route.get("/city/:province_id", rajaongkirController.getCity);

module.exports = route;