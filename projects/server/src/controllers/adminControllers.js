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

            return res.status(200).send({
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
        const ormTransaction = await model.sequelize.transaction();
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
                }, {
                    transaction: ormTransaction,
                })
                // console.log(`deleteAdmin`, deleteAdmin);

                await ormTransaction.commit();
                return res.status(200).send({
                    success: true,
                    message: "Admin Is Now InActive"
                })
            } else {
                let deleteAdmin = await model.admin.update({ isDeleted: 0 }, {
                    where: {
                        uuid: req.params.uuid
                    }
                }, {
                    transaction: ormTransaction,
                })
                // console.log(`deleteWarehouse`, deleteAdmin);

                await ormTransaction.commit();
                return res.status(200).send({
                    success: true,
                    message: "Admin is now Active"
                })
            }
        } catch (error) {
            await ormTransaction.rollback();
            console.log(error);
            next(error)
        }
    },

    editAdmin: async (req, res, next) => {
        const ormTransaction = await model.sequelize.transaction();
        try {
            // console.log(`ini dari req params`, req.params.uuid);
            let cekAdmin = await model.admin.findAll({
                where: {
                    [sequelize.Op.or]: [
                        { name: req.body.name },
                        { email: req.body.email },
                        { phone: req.body.phone }
                    ],
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
                }, {
                    transaction: ormTransaction,
                })

                // console.log(editAdmin);

                await ormTransaction.commit();
                return res.status(200).send({
                    success: true,
                    message: "admin updated",
                    data: editAdmin
                })

            } else {
                await ormTransaction.commit();
                return res.status(400).send({
                    success: false,
                    message: "name, email, phone number already exists",
                    description: "please check and ensure that email, username, phone number is unique"
                })
            }
        } catch (error) {
            await ormTransaction.rollback();
            console.log(error);
            next(error)
        }
    },
}
