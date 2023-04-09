const { check, validationResult } = require('express-validator');

module.exports = {
    checkUsers: async (req, res, next) => {
        try {
            console.log('request path:', req.path);
            if (req.path == '/customer/register') {
                await check('email').notEmpty().isEmail().withMessage('Email requirment are not met').run(req);
            }
            else if (req.path == '/admin/register') {
                await check('email').notEmpty().isEmail().withMessage('Email requirment are not met').run(req);
                await check('password').notEmpty().isStrongPassword({
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                }).withMessage('Your password is to short or requirment are not met').run(req);
            }
            else if (req.path == '/customer/verify') {
                await check('password').notEmpty().isStrongPassword({
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                }).withMessage('Your password is to short or requirment are not met').run(req);
            }
            const validation = validationResult(req);
            console.log('validation result:', validation);
            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Validation invalid',
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    checkWarehouse: async (req, res, next) => {
        try {

            console.log('request path:', req.path);
            if (req.path == '/') {
                await check('email').notEmpty().isEmail().withMessage('Email requirment are not met').run(req);
            }

            const validation = validationResult(req);
            console.log('validation result:', validation);

            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Validation invalid',
                    error: validation.errors
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    editProfile: async (req, res, next) => {
        try {
            console.log("req path:", req.path)
            if (req.path == '/edit') {
                await check("name").notEmpty().isLength({ max: 100 }).withMessage("name must not be empty and must less than equal to 100 character").matches(/^[a-zA-Z ]+$/)
                    .withMessage("Name must only contain letters and spaces")
                    .run(req);
                await check("phone").notEmpty().isMobilePhone().withMessage("Invalid phone number").run(req);
                await check("gender").notEmpty().isIn(["Male", "Female"]).withMessage("Gender must not be empty").run(req);
            }
            const validation = validationResult(req)
            console.log("validation result:", validation);
            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Validation invalid',
                    error: validation.errors
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

}