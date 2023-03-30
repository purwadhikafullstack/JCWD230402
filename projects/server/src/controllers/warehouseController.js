const model = require("../models");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    addNewWarehouse: async (req, res, next) => {
        try {
            console.log(`ini dari req body`, req.body);

            const uuid = uuidv4();
            const { name, email, address, province, city, postalCode, phone, city_id, provinceId } = req.body
            let addNewWarehouse = await model.warehouse.create({
                uuid, name, email, address, province, city, postalCode, phone, city_id, province_id: provinceId
            })

            return res.status(200).send({
                success: true,
                message: "warehouse added",
                data: addNewWarehouse
            })

        } catch (error) {
            next(error)
        }
    },

    getWarehouse: async (req, res, next) => {
        try {
            let data = await model.warehouse.findAll()

            return res.status(200).send(data)

        } catch (error) {
            next(error)
        }
    },

    updateWarehouse: async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    }


}