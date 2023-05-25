const model = require("../models");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("sequelize");
const axios = require("axios");

module.exports = {
  addNewWarehouse: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      // console.log(`ini dari req body`, req.body);
      let cekWarehouse = await model.warehouse.findAll({
        where: sequelize.or(
          { name: req.body.name },
          { email: req.body.email },
          { phone: req.body.phone },
          { address: req.body.address }
        ),
      });
      // console.log(`ini cekwarehouse`, cekWarehouse);

      if (cekWarehouse.length == 0) {
        const uuid = uuidv4();
        const {
          name,
          email,
          address,
          province,
          city,
          postalCode,
          phone,
          city_id,
          provinceId,
        } = req.body;

        let koordinat = await (
          await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OPENCAGE_KEY}`
          )
        ).data;
        // console.log(`ini koordinat`, koordinat.results[0].geometry.lat);

        let lat = koordinat.results[0].geometry.lat;
        let lng = koordinat.results[0].geometry.lng;
        let location = lat + "," + lng;

        let addNewWarehouse = await model.warehouse.create({
          uuid,
          name,
          email,
          address,
          province,
          city,
          postalCode,
          phone,
          city_id,
          province_id: provinceId,
          location: location,
        }, {
          transaction: ormTransaction,
        });

        // console.log(addNewWarehouse);

        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "warehouse added",
          data: addNewWarehouse,
        });
      } else {
        await ormTransaction.commit();
        return res.status(400).send({
          success: false,
          message: "name, email, phone, or address exist",
        });
      }
    } catch (error) {
      await ormTransaction.rollback();
      console.log(`error`, error);
      next(error);
    }
  },

  getWarehouse: async (req, res, next) => {
    try {
      // buat page warehouse
      let { page, size, name, sortby, order } = req.query;

      let data = await model.warehouse.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        where: {
          name: { [sequelize.Op.like]: `%${name}%` },
        },
        order: [[sortby, order]],
      });
      // console.log(`data`, data);

      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllWarehouse: async (req, res, next) => {
    try {
      //buat page product edit
      if (req.query.warehouseId) {
        let data = await model.warehouse.findAll({
          where: {
            id: req.query.warehouseId,
          },
        });
        // console.log(`data pake query`, data);

        return res.status(200).send(data);
      } else {
        let data = await model.warehouse.findAll({
          where: {
            isDisabled: 0,
          },
        });
        // console.log(`data semua warehouse`, data);

        return res.status(200).send(data);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateWarehouse: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      // console.log(`ini dari req params`, req.params.uuid);
      const {
        name,
        email,
        address,
        province,
        city,
        postalCode,
        phone,
        city_id,
        provinceId,
      } = req.body;

      let cekWarehouse = await model.warehouse.findAll({
        where: sequelize.or(
          { name: name },
          { email: email },
          { address: address },
          { phone: phone }
        )
      });
      // console.log(`ini cekwarehouse`, cekWarehouse);

      if (cekWarehouse.length == 0) {
        // const uuid = uuidv4();

        let koordinat = await (
          await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OPENCAGE_KEY}`
          )
        ).data;
        // console.log(`ini koordinat`, koordinat.results[0].geometry.lat);

        let lat = koordinat.results[0].geometry.lat;
        let lng = koordinat.results[0].geometry.lng;
        let location = lat + "," + lng;

        let editWarehouse = await model.warehouse.update(
          {
            name,
            email,
            address,
            province,
            city,
            postalCode,
            phone,
            city_id,
            province_id: provinceId,
            location: location,
          },
          {
            where: {
              uuid: req.params.uuid,
            },
          }, {
          transaction: ormTransaction,
        });

        // console.log(`editWarehouse`, editWarehouse);

        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "warehouse update",
          data: editWarehouse,
        });
      } else {
        await ormTransaction.commit();
        return res.status(400).send({
          success: false,
          message: "name, email, phone, or address exist",
        });
      }
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },

  deleteWarehouse: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      let findWarehouse = await model.warehouse.findAll({
        where: {
          uuid: req.params.uuid,
        },
      });

      // console.log(`findwarehouse`, findWarehouse[0].dataValues.isDisabled);

      if (findWarehouse[0].dataValues.isDisabled == false) {
        let deleteWarehouse = await model.warehouse.update(
          { isDisabled: 1 },
          {
            where: {
              uuid: req.params.uuid,
            },
          }, {
          transaction: ormTransaction,
        });
        // console.log(`deleteWarehouse`, deleteWarehouse);

        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "warehouse is not operating",
        });
      } else {
        let deleteWarehouse = await model.warehouse.update(
          { isDisabled: 0 },
          {
            where: {
              uuid: req.params.uuid,
            },
          }, {
          transaction: ormTransaction,
        });
        // console.log(`deleteWarehouse`, deleteWarehouse);

        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "warehouse is now operating",
        });
      }
    } catch (error) {
      await ormTransaction.rollback();
      console.log(`ini error`, error);
      next(error);
    }
  },
};
