const { profileController } = require("../controllers");
const express = require("express");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { editProfile } = require("../helpers/validator")
const uploader = require('../helpers/uploader')

route.patch("/edit", readToken, editProfile, profileController.editProfileUser);
route.get("/", readToken, profileController.getUser);
route.get("/address", readToken, profileController.getAddress);
route.post("/address", readToken, profileController.addNewAddress);
route.patch("/address", readToken, profileController.updateAddress);
route.delete("/address", readToken, profileController.deleteAddress);
route.patch("/updateprofileimage", readToken, uploader('/profileImage', 'PRF').array('profileImage', 1), profileController.updateprofileimage);

module.exports = route;