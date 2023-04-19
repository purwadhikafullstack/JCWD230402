const { check, validationResult } = require('express-validator');
const model = require('../models')
const { createToken } = require('../helpers/jwt')
const { sequelize } = require('../models')
const { v4: uuidv4 } = require('uuid')
const transporter = require("../helpers/nodemailer")
const bcrypt = require('bcrypt')

let salt = bcrypt.genSaltSync(10);
module.exports = {

    // Register
    register: async (req, res, next) => {
        try {
            let checkUser = await model.customer.findAll({
                where: {
                    email: req.body.email,

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

                let register = await model.customer.create({ email, uuid, statusId: 1 });

                let token = createToken({
                    uuid: register.dataValues.uuid,
                    email: register.dataValues.email,
                }, '24h')

                //send verification email//

                await transporter.sendMail({
                    from: `Admin GadgetHouse`,
                    to: `${email}`,
                    subject: "GadgetHouse User Account Verification",
                    html: `<img src="" />
            <hr />
            <h3>Hello, ${email}</h3>
            <h3>Thank you for registering your account with GadgetHouse! 😃</h3>
            <h5>
              To finish setting up your account and buy our products, click the link below for your account verification.
            </h5>
            <h5>
              <a href="http://localhost:3000/Verify/${token}"
                >Verify Your Account Here</a
              >
            </h5>
            <br>
            <br>
            <p>Regards, Admin GadgetHouse</p>`,
                })

                return res.status(200).send({
                    success: true,
                    message: "Account registered success please check your email to verify your account",
                    data: register,
                    token: token

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

    verify: async (req, res, next) => {

        try {

            console.log('data dari token', req.decript)
            let checkUser = await model.customer.findAll({
                where: {
                    uuid: req.decript.uuid
                }
            });
            console.log("check user exist", checkUser);
            if (checkUser.length > 0) {
                if (req.body.password === req.body.confirmationpassword) {
                    console.log('data before hash', req.body);
                    req.body.password = bcrypt.hashSync(req.body.password, salt)

                    let verification = await model.customer.update(
                        { password: req.body.password, statusId: 2 },

                        { where: { uuid: req.decript.uuid } }
                    );
                    return res.status(200).send({
                        success: true,
                        message: "your Account is now verified",
                        data: verification
                    });
                } else {
                    return res.status(400).send({
                        success: false,
                        message: "Password and Confirmation password are not equal"
                    })
                }

            } else {
                return res.status(400).send({
                    success: false,
                    message: " Verification failed"
                })
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    login: async (req, res, next) => {
        try {
            console.log("data from req", req.body);

            let get = await model.customer.findAll({
                where:
                    { email: req.body.email }
            })
            console.log("for get user login", get)
            if (get.length > 0) {
                let check = bcrypt.compareSync(req.body.password, get[0].dataValues.password);

                if (check) {
                    let { uuid, name, email, phone, gender, profileImage, statusId } = get[0].dataValues;
                    let token = createToken({ uuid, statusId });
                    return res.status(200).send({
                        success: true,
                        message: "login success",

                        name: name,
                        email: email,
                        phone: phone,
                        gender: gender,
                        profileImage: profileImage,
                        statusId: statusId,
                        token: token
                    })
                } else {
                    res.status(400).send({
                        success: false,
                        message: "Login fail email or password wrong"
                    })
                }
            } else {
                res.status(404).send({
                    success: false,
                    message: "Account not found"
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    keepLogin: async (req, res, next) => {
        try {
            console.log("Decript token:", req.decript);
            let get = await model.customer.findAll({
                where: {
                    uuid: req.decript.uuid
                }
            });

            console.log("Data from get[0].dataValues", get[0].dataValues);

            let { uuid, name, email, phone, gender, profileImage, statusId } = get[0].dataValues
            let token = createToken({ uuid }, "24h");

            return res.status(200).send({
                success: true,
                message: "login success",
                name: name,
                email: email,
                phone: phone,
                gender: gender,
                profileImage: profileImage,
                statusId: statusId,
                token: token
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    forgotpassword: async (req, res, next) => {
        try {
            //.email data user
            let getData = await model.customer.findAll({
                where: {
                    email: req.body.email,
                }
            });
            console.log("data dari get data", getData[0].dataValues)

            //send email and create token
            let { id, statusId } = getData[0].dataValues;
            let token = createToken({ id, statusId }, '24h');
            const { email } = req.body

            //send reset password by email
            await transporter.sendMail({
                from: "GadgetHouse Admin",
                to: `${email}`,
                subject: "Reset Password",
                html:
                    `<img src="" />
                <hr />
                <h3>Hello, ${email}</h3>
                <h3>We've recieved a request to reset your password! 😃</h3>
                <h5>
                  Click the link below for reset your password.
                </h5>
                <h5>
                  <a href="http://localhost:3000/reset/${token}"
                    >Reset Your Password</a
                  >
                </h5>
                <br>
                <br>
                <p>Regards, Admin GadgetHouse</p>`
            });
            res.status(200).send({
                success: true,
                message: "Email for confirmation reset password has been delivered",
                token: token
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    resetpassword: async (req, res, next) => {
        try {
            if (req.body.Password === req.body.confirmationPassword) {
                console.log("dcript token", req.decript);
                req.body.password = bcrypt.hashSync(req.body.password, salt);

                await model.customer.update({ password: req.body.password },
                    {
                        where: {
                            id: req.decript.id,
                        },
                    }
                );
                return res.status(200).send({
                    success: true,
                    message: "Reset password success"
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: "error: password and confirmation password not match"
                })
            }

        } catch (error) {
            console.log(error)
            next(error)

        }
    },

    adminregister: async (req, res, next) => {
        try {
            let checkUser = await model.admin.findAll({
                where: {
                    email: req.body.email,
                }
            });
            console.log("check user exist", checkUser.length);

            if (checkUser.length === 0) {
                // if (req.body.password == req.body.confirmationPassword) {
                //     delete req.body.confirmationPassword
                //     console.log("check data before create", req.body);
                //     req.body.password = bcrypt.hashSync(req.body.password.salt);
                //     console.log("check data after  hash password :", req.body);

                const uuid = uuidv4();
                req.body.password = bcrypt.hashSync(req.body.password, salt)
                const { name, gender, phone, email, password, roleId, warehouseId, profileImage } = req.body

                let register = await model.admin.create({
                    email,
                    uuid,
                    name,
                    gender,
                    phone,
                    password,
                    roleId,
                    warehouseId,
                    profileImage
                });

                return res.status(200).send({
                    success: true,
                    message: "Account Registration Success",
                    data: register,


                })
            } else {
                return res.status(400).send({
                    success: false,
                    message: "User Already Exists"
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    adminlogin: async (req, res, next) => {
        try {
            // console.log("data from req", req.body);

            let get = await model.admin.findAll({
                where:
                    { email: req.body.email }
            })
            // console.log("for get admin login", get)
            if (get.length > 0) {
                let check = bcrypt.compareSync(req.body.password, get[0].dataValues.password);

                if (check) {
                    let { email, uuid, name, gender, phone, roleId, warehouseId, profileImage } = get[0].dataValues;
                    let token = createToken({ uuid, roleId });
                    console.log(`ini token admin login`, token);
                    return res.status(200).send({
                        success: true,
                        message: "login success",
                        name: name,
                        email: email,
                        warehouseId: warehouseId,
                        phone: phone,
                        gender: gender,
                        profileImage: profileImage,
                        roleId: roleId,
                        token: token
                    })
                } else {
                    res.status(400).send({
                        success: false,
                        message: "Login fail email or password wrong"
                    })
                }
            } else {
                res.status(404).send({
                    success: false,
                    message: "Account not found"
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    keepadminLogin: async (req, res, next) => {
        try {
            console.log("Decript token:", req.decript);
            let get = await model.admin.findAll({
                where: {
                    uuid: req.decript.uuid,
                    roleId: req.decript.roleId
                }
            });

            // console.log("Data from get[0].dataValues", get[0].dataValues);

            let { email, uuid, name, gender, phone, roleId, warehouseId, profileImage } = get[0].dataValues
            let token = createToken({ uuid, roleId }, "24h");

            return res.status(200).send({
                success: true,
                message: "keep admin login success",
                name: name,
                email: email,
                roleId: roleId,
                warehouseId: warehouseId,
                phone: phone,
                gender: gender,
                profileImage: profileImage,
                token: token
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    edit: async (req, res, next) => {
        try {
          console.log("Decript token:", req.decript);
          const uuid = uuidv4();
          const { name, gender, phone } = req.body;
          if (name || gender || phone) {
            await model.customer.update(
              req.body,
              {
                where: {
                  uuid: req.decrypt.uuid,
                },
              }
            );
            return res.status(200).send({
              success: true,
              message: "Edit profile success ",
            });
          } else {
            res.status(400).send({
              success: false,
              message: "Cannot change data",
            });
          }
        } catch (error) {
          console.log(error);
          next(error);
        }
      },

}
