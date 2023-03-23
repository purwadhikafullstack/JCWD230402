const {check,validationResult} = require('express-validator');

module.exports ={
    checkUsers: async (req,res,next)=>{
        try {
            console.log('request path:',req.path);
            if(req.path =='/Register'){
            await check('username').notEmpty().isAlphanumeric().run(req);
            await check('email').notEmpty().isEmail().run(req);
            } else if(req.path =='/auth'){
                // await check('username').optional({nullable:true}).isAlphanumeric.run(req);
                await check('email').optional({nullable:true}).isEmail().run(req);
            }
            await check('password').notEmpty().isStrongPassword({
                minLength:5,
                minLowercase:1,
                minUppercase:1,
                minNumbers:1,
                minSymbols:0
            }).withMessage('Your password is to short or requirment are not met').run(req);

            const validation = validationResult(req);
            console.log('validation result:',validation);
            if(validation.isEmpty()){
                next();
            }else {
                return res.status(400).send({
                    success: false,
                    message:'Validation invalid',
                    error:validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}