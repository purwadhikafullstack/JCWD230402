const { checkoutController } = require("../controllers");
const express = require("express");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { checkUsers } = require("../helpers/validator")

route.post("/", checkoutController.distance);

module.exports = route;