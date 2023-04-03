const model = require('../models')
const { sequelize } = require('../models')
const { v4: uuidv4 } = require('uuid')
const transporter = require("../helpers/nodemailer")
const bcrypt = require('bcrypt')

let salt = bcrypt.genSaltSync(10);

module.exports = {
    allAdmin: async (req, res, next) => {
        try {
            let getAllAdmin = await model.admin.findAll({
                include: [{
                    model: model.warehouse,
                    attributes: ["name"]
                }]
            })
            console.log(`getalladmin`, getAllAdmin);

            res.status(200).send({
                success: true,
                data: getAllAdmin
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    deleteAdmin: async (req, res, next) => {
        try {
            let findAdmin = await model.admin.findAll({
                where: {
                    uuid: req.params.uuid
                }
            })

            console.log(`findadmin`, findAdmin);

            if (findAdmin[0].dataValues.isDeleted == false) {

                let deleteAdmin = await model.admin.update({ isDeleted: 1 }, {
                    where: {
                        uuid: req.params.uuid
                    }
                })
                console.log(`deleteAdmin`, deleteAdmin);
                res.status(200).send({
                    success: true,
                    message: "admin unavailable"
                })
            } else {
                let deleteAdmin = await model.admin.update({ isDeleted: 0 }, {
                    where: {
                        uuid: req.params.uuid
                    }
                })
                console.log(`deleteWarehouse`, deleteAdmin);
                res.status(200).send({
                    success: true,
                    message: "admin available"
                })
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    editAdmin: async (req, res, next) => {
        try {
            console.log(`ini dari req params`, req.params.uuid);
            let cekAdmin = await model.admin.findAll({
                where: {
                    uuid: req.params.uuid
                }
            });
            console.log(`ini cekAdmin`, cekAdmin);

            if (cekAdmin.length == 1) {
                req.body.password = bcrypt.hashSync(req.body.password, salt)
                const { name, email, phone, gender, password, warehouseId } = req.body

                let editAdmin = await model.admin.update({
                    name,
                    email,
                    phone,
                    gender,
                    password,
                    warehouseId,
                }, {
                    where: {
                        uuid: req.params.uuid
                    }
                })

                // console.log(editAdmin);

                return res.status(200).send({
                    success: true,
                    message: "admin update",
                    data: editAdmin
                })

            } else {
                return res.status(400).send({
                    success: false,
                    message: "name, email, phone exist"
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },
}
