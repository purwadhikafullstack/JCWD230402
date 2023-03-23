const {authController} = require ("../controllers");
const express = require ("express");
const route = express.Router();

route.post('/customer/register',authController.register);

module.exports= route;
