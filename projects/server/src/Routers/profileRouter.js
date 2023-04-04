const { profileController } = require("../controllers");
const express = require("express");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { editProfile } = require("../helpers/validator")

route.patch("/edit", readToken, editProfile, profileController.editProfile);

module.exports = route;