const axios = require("axios");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1c19OaVRzS1RyS05Nc3pPNiIsIm1vZXNpZlByaWNpbmdJZCI6InByaWNlXzFNUXF5dkJESWxQbVVQcE1SWUVWdnlLZSIsImlhdCI6MTY4MTU0MTM0NX0.MvrqXhkTRIBMRWFnfZSm8N2MUB_vnKHgzi-RS6xqlV4";

module.exports = {
  getProduct: async (req, res, next) => {
    try {
      const query = req.query.query;
      const replacedStr = query.replace(/ /g, "%20");

      let response = await axios.post(
        `https://api.techspecs.io/v4/product/search?query=${replacedStr}`,
        {},
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Extracting the data from the response object
      const responseData = response.data;
      const productId = responseData.data.items[0].product.id;
      //   console.log(responseData.data.items[0].product.id);

      let getdetail = await axios.get(
        ` https://api.techspecs.io/v4/product/detail?productId=${productId}`,
        {
          headers: {
            accept: "application/json",
            "Accept-Encoding": "",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const getDetailData = getdetail.data.data.items[0];
      console.log("getDetailData = ", getdetail.data.data.items[0]);

      // Sending the extracted data as response
      return res.status(200).send(getDetailData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
