const { categoryController } = require("../controllers");
const express = require("express");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { checkUsers } = require("../helpers/validator")

route.post("/", readToken, categoryController.addCategory);
route.get("/", readToken, categoryController.getCategory);
route.delete("/:id", readToken, categoryController.deleteCategory);
route.patch("/:id", readToken, categoryController.editCategory);

module.exports = route;