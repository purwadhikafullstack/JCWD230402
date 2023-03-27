const { check, validationResult } = require('express-validator');

module.exports = {
    checkUsers: async (req, res, next) => {
        try {
            console.log('request path:', req.path);
            if (req.path == '/customer/register') {
                await check('email').notEmpty().isEmail().withMessage('Email requirment are not met').run(req);
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
    }
}