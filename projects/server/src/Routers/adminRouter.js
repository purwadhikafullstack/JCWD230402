const { adminController } = require("../controllers");
const express = require("express");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { checkUsers } = require("../helpers/validator")

route.get("/", readToken, adminController.allAdmin);
route.delete("/:uuid", readToken, adminController.deleteAdmin);
route.patch("/:uuid", readToken, adminController.editAdmin);

module.exports = route;