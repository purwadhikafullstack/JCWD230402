const sequelize = require("sequelize");
const model = require("../models");
const axios = require("axios");

module.exports = {
  distance: async (req, res, next) => {
    try {
      console.log(`req.body`, req.body);

      let getWarehouse = await model.warehouse.findAll(
        {
          attributes: [
            "id",
            "name",
            "location",
            "province_id",
            "city_id",
            "uuid",
          ],
        },
        {
          where: {
            isDisabled: 0,
          },
        }
      );
      let tempArr = [];
      for (let i = 0; i < getWarehouse.length; i++) {
        let temp = {};
        const R = 6371; // km (change this constant to get miles)
        let lat2 = getWarehouse[i].dataValues.location.split(",")[0];
        let lon2 = getWarehouse[i].dataValues.location.split(",")[1];
        let lat1 = req.body.customerAddress.split(",")[0];
        let lon1 = req.body.customerAddress.split(",")[1];

        let dLat = ((lat2 - lat1) * Math.PI) / 180;
        let dLon = ((lon2 - lon1) * Math.PI) / 180;
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        // console.log(`d`, d);

        temp.id = getWarehouse[i].dataValues.id;
        temp.uuid = getWarehouse[i].dataValues.uuid;
        temp.distance = d;
        temp.name = getWarehouse[i].dataValues.name;
        temp.city_id = getWarehouse[i].dataValues.city_id;

        tempArr.push(temp);
      }
      tempArr.sort((a, b) => {
        return a.distance - b.distance;
      });

      const fixDistance = tempArr[0];
      console.log(`fixDistance`, tempArr);

      let ongkir = await axios.post(
        `https://api.rajaongkir.com/starter/cost`,
        {
          origin: fixDistance.city_id,
          destination: req.body.city_id,
          weight: 1000,
          courier: "jne",
        },
        {
          headers: {
            key: `d7b2b7169e378cf16e957b2d0e9d8371`,
          },
        }
      );

      console.log(`ongkir`, ongkir);

      res.status(200).send({
        data: ongkir.data.rajaongkir.results,
        warehouse: fixDistance.uuid,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
