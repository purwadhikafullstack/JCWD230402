const {check,validationResult} = require('express-validator');
const model = require('../models')
const {createToken} = require('../helpers/jwt')
const {sequelize} = require('../models')
const {v4: uuidv4} = require ('uuid')
module.exports = {

    // Register
    register: async (req, res, next) => {
        try {
            let checkUser = await model.customer.findAll({
                where: {
                email: req.body.email 
                }
            });
            console.log("check user exist", checkUser);

            if (checkUser.length === 0) {
                // if (req.body.password == req.body.confirmationPassword) {
                //     delete req.body.confirmationPassword
                //     console.log("check data before create", req.body);
                //     req.body.password = bcrypt.hashSync(req.body.password.salt);
                //     console.log("check data after  hash password :", req.body);

                    const uuid = uuidv4();
                    const { email } = req.body

                    let register = await model.customer.create({email,uuid});
                    // let token = createToken({
                    //     id: register.dataValues.id,
                    //     email: register.dataValues.email
                    // }, '1h')

                    //send verification email//
                    // await transporter.sendMail({
                    //     from: "", // ini nanti isi email dari websitenya
                    //     to: req.body.email,
                    //     subject: "Account verification",
                    //     html: `<div>
                    // <h3>Click link bellow</h3>
                    // <a href="http://localhost/8000/"ini isi diarahin ke pact yg dituju"/${token}">Verify</a>
                    // </div>`
                    // })
                    return res.status(200).send({
                        success: true,
                        message: "Account registered success",
                        data: register
                    })
            } else {
                    return res.status(400).send({
                        success: false,
                        message: "User already exist"
                    })
                }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },
}