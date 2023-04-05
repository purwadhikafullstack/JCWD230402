const model = require('../models')
const sequelize = require("sequelize");
const bcrypt = require('bcrypt')

let salt = bcrypt.genSaltSync(10);

module.exports = {
    allAdmin: async (req, res, next) => {
        try {
            let { page, size, name, sortby, order } = req.query

            let getAllAdmin = await model.admin.findAndCountAll({
                offset: parseInt(page * size),
                limit: parseInt(size),
                where: { name: { [sequelize.Op.like]: `%${name}%` } },
                include: [{
                    model: model.warehouse,
                    attributes: ["name"]
                }],
                order: [[sortby, order]],
            })
            // console.log(`getalladmin`, getAllAdmin);

            res.status(200).send({
                success: true,
                data: getAllAdmin.rows,
                datanum: getAllAdmin.count,
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

            // console.log(`findadmin`, findAdmin);

            if (findAdmin[0].dataValues.isDeleted == false) {

                let deleteAdmin = await model.admin.update({ isDeleted: 1 }, {
                    where: {
                        uuid: req.params.uuid
                    }
                })
                // console.log(`deleteAdmin`, deleteAdmin);
                res.status(200).send({
                    success: true,
                    message: "Admin Is Now Unavailable"
                })
            } else {
                let deleteAdmin = await model.admin.update({ isDeleted: 0 }, {
                    where: {
                        uuid: req.params.uuid
                    }
                })
                // console.log(`deleteWarehouse`, deleteAdmin);
                res.status(200).send({
                    success: true,
                    message: "Admin is now Available"
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
                    [sequelize.Op.or]: [
                        { name: req.body.name },
                        { email: req.body.email },
                        { phone: req.body.phone }
                    ],
                    uuid: { [sequelize.Op.ne]: req.params.uuid }
                }
            });
            // console.log(`ini cekAdmin`, cekAdmin);

            if (cekAdmin.length == 0) {
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
                    message: "admin updated",
                    data: editAdmin
                })

            } else {
                return res.status(400).send({
                    success: false,
                    message: "name, email, phone number already exists",
                    description: "please check and ensure that email, username, phone number is unique"
                })
            }


        } catch (error) {
            console.log(error);
            next(error)
        }
    },
}
