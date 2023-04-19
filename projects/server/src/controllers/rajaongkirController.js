const axios = require("axios");

module.exports = {
  getProvince: async (req, res, next) => {
    try {
      let response = await axios.get(
        `https://api.rajaongkir.com/starter/province`,
        {
          headers: {
            key: `d7b2b7169e378cf16e957b2d0e9d8371`,
          },
        }
      );
      // console.log(`ini res getProvince`, response.data);

      return res.status(200).send(response.data);
    } catch (error) {
      console.log(`error get`, error);
      next(error);
    }
  },

  getCity: async (req, res, next) => {
    try {
      let { province_id } = req.params;
      console.log(`ini dr req.params`, req.params);
      let response = await axios.get(
        `https://api.rajaongkir.com/starter/city?province=${province_id}`,
        {
          headers: {
            key: `d7b2b7169e378cf16e957b2d0e9d8371`,
          },
        }
      );
      console.log(`ini res getCity`, response.data);

      return res.status(200).send(response.data);
    } catch (error) {
      console.log(`error getcity`, error);
      next(error);
    }
  },
};
