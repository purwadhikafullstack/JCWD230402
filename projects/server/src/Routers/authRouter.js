const { authController } = require("../controllers");
const express = require("express");
const { readToken } = require('../helpers/jwt');
const route = express.Router();
const { checkUsers } = require("../helpers/validator")

route.post('/customer/register', checkUsers, authController.register);
route.patch('/customer/verify', readToken, checkUsers, authController.verify);
route.post('/customer', authController.login);
route.get('/customer/keep-login', readToken, authController.keepLogin);
route.post('/customer/forgot-password', authController.forgotpassword);
route.patch('/customer/reset', readToken, authController.resetpassword);
route.post('/admin/register', readToken, checkUsers, authController.adminregister);
route.post('/admin/login', authController.adminlogin);
route.get('/admin/keep-adminlogin', readToken, authController.keepadminLogin);
route.patch('/edit', readToken, authController.edit )
module.exports = route;
