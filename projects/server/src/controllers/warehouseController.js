const model = require("../models");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("sequelize")
const axios = require("axios");

module.exports = {
  addNewWarehouse: async (req, res, next) => {
    try {
      console.log(`ini dari req body`, req.body);
      let cekWarehouse = await model.warehouse.findAll({
        where: sequelize.or(
          { name: req.body.name },
          { email: req.body.email },
          { phone: req.body.phone },
          { address: req.body.address }
        ),
      });
      console.log(`ini cekwarehouse`, cekWarehouse);

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
            `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=e2823746c2e14794a1a9f2b316dbaeb2`
          )
        ).data;
        console.log(`ini koordinat`, koordinat.results[0].geometry.lat);

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
        });

        // console.log(addNewWarehouse);

        return res.status(200).send({
          success: true,
          message: "warehouse added",
          data: addNewWarehouse,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "name, email, phone, or address exist",
        });
      }
    } catch (error) {
      console.log(`error`, error);
      next(error);
    }
  },

  getWarehouse: async (req, res, next) => {
    try {
      // buat page warehouse 
      let { page, size, name, sortby, order } = req.query

      let data = await model.warehouse.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        where: {
          name: { [sequelize.Op.like]: `%${name}%` }
        },
        order: [[sortby, order]]
      });
      console.log(`data`, data);

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
        console.log(`data pake query`, data);

        return res.status(200).send(data);
      } else {
        let data = await model.warehouse.findAll(
          {
            where: {
              isDisabled: 0
            }
          }
        );
        console.log(`data semua warehouse`, data);

        return res.status(200).send(data);
      }

    } catch (error) {
      console.log(error);
      next(error);
    }


  },

  updateWarehouse: async (req, res, next) => {
    try {
      console.log(`ini dari req params`, req.params.uuid);
      let cekWarehouse = await model.warehouse.findAll({
        where: {
          uuid: req.params.uuid,
        },
      });
      console.log(`ini cekwarehouse`, cekWarehouse);

      if (cekWarehouse.length == 1) {
        // const uuid = uuidv4();
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
            `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=e2823746c2e14794a1a9f2b316dbaeb2`
          )
        ).data;
        console.log(`ini koordinat`, koordinat.results[0].geometry.lat);

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
          }
        );

        console.log(editWarehouse);

        return res.status(200).send({
          success: true,
          message: "warehouse update",
          data: editWarehouse,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "name, email, phone, or address exist",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteWarehouse: async (req, res, next) => {
    try {
      let findWarehouse = await model.warehouse.findAll({
        where: {
          uuid: req.params.uuid,
        },
      });

      console.log(`findwarehouse`, findWarehouse[0].dataValues.isDisabled);

      if (findWarehouse[0].dataValues.isDisabled == false) {
        let deleteWarehouse = await model.warehouse.update(
          { isDisabled: 1 },
          {
            where: {
              uuid: req.params.uuid,
            },
          }
        );
        console.log(`deleteWarehouse`, deleteWarehouse);
        res.status(200).send({
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
          }
        );
        console.log(`deleteWarehouse`, deleteWarehouse);
        res.status(200).send({
          success: true,
          message: "warehouse is now operating",
        });
      }
    } catch (error) {
      console.log(`ini error`, error);
      next(error);
    }
  },
};
