const { check, validationResult } = require("express-validator");
const model = require("../models");
const { createToken } = require("../helpers/jwt");
const sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../helpers/nodemailer");
const bcrypt = require("bcrypt");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  getUser: async (req, res, next) => {
    try {
      let getUser = await model.customer.findAll({});
      console.log(`getUser`, getUser);

      return res.status(200).send({
        success: true,
        data: getUser,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  editProfileUser: async (req, res, next) => {
    try {
      console.log("Decript token:", req.decript);
      const uuid = uuidv4();
      const { name, gender, phone } = req.body;
      if (name || gender || phone) {
        await model.customer.update(req.body, {
          where: {
            uuid: req.decript.uuid,
          },
        });
        return res.status(200).send({
          success: true,
          message: "Edit profile success ",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Cannot change data",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  // ------------------------------------Address--------------------------------//
  addNewAddress: async (req, res, next) => {
    try {
      console.log("from req body:", req.body);
      let checkAddress = await model.address.findAll({
        where: {
          address: req.body.address,
        },
      });

      if (checkAddress.length == 0) {
        // function get customerid berdasarkan uuid dri token yg lgi login
        let getcustomer = await model.customer.findAll({
          where: {
            uuid: req.decript.uuid,
          },
        });
        let customerid = getcustomer[0].dataValues.id;

        await model.address.update({
          isPrimary: 0
        }, {
          where: {
            customerId: getcustomer[0].dataValues.id
          }
        })

        const uuid = uuidv4();
        const {
          address,
          province,
          city,
          postalCode,
          city_id,
          province_id
        } = req.body;

        let coordinate = await (
          await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OPENCAGE_KEY}`
          )
        ).data;
        // console.log('this coordinate:', coordinate.results[0].geometry.lat)

        let lat = coordinate.results[0].geometry.lat;
        let lng = coordinate.results[0].geometry.lng;
        let location = lat + "," + lng;

        let addNewAddress = await model.address.create({
          uuid,
          address,
          province,
          city,
          postalCode,
          city_id,
          province_id: province_id,
          location: location,
          customerId: customerid,
          isDeleted: 0,
          isPrimary: 1
        });
        return res.status(200).send({
          success: true,
          message: "Address Added",
          data: addNewAddress,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "address exist",
        });
      }
    } catch (error) {
      console.log(`error`, error);
      next(error);
    }
  },

  getAddress: async (req, res, next) => {
    try {
      let data = await model.address.findAll({
        where: {
          customerId: req.params.id
        }
      });
      console.log(`data`, data);

      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  },

  updateAddress: async (req, res, next) => {
    try {
      console.log("id = ", req.body.id);
      let cekAddress = await model.address.findAll({
        where: {
          address: req.body.address,
          id: { [sequelize.Op.ne]: req.body.id },
        },
      });
      console.log(`ini cekAddress`, cekAddress);

      if (cekAddress.length == 0) {
        // const uuid = uuidv4();
        const { address, province, city, postalCode, city_id, province_id } =
          req.body;

        let coordinate = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OPENCAGE_KEY}`
        );

        console.log(`ini coordinate`, coordinate.results);

        let lat = coordinate.results[0].geometry.lat;
        let lng = coordinate.results[0].geometry.lng;
        let location = lat + "," + lng;

        let editAddress = await model.address.update(
          {
            address,
            province,
            city,
            postalCode,
            city_id,
            province_id: province_id,
            location: location,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );

        console.log(editAddress);

        return res.status(200).send({
          success: true,
          message: "Address update",
          data: editAddress,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "address exist",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteAddress: async (req, res, next) => {
    try {
      let findAddress = await model.address.findAll({
        where: {
          uuid: req.decript.uuid,
        },
      });

      console.log(`findAddress`, findAddress[0].dataValues.isDisabled);

      if (findAddress[0].dataValues.isDisabled == false) {
        let deleteAddress = await model.address.update(
          { isDisabled: 1 },
          {
            where: {
              uuid: req.decript.uuid,
            },
          }
        );
        console.log(`deleteAddress`, deleteAddress);
        return res.status(200).send({
          success: true,
        });
      } else {
        let deleteAddress = await model.addresses.update(
          { isDisabled: 0 },
          {
            where: {
              uuid: req.decript.uuid,
            },
          }
        );
        console.log(`deleteAddress`, deleteAddress);
        return res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      console.log(`ini error`, error);
      next(error);
    }
  },

  //-----------------------------Profile picture-----------------------------------//
  updateprofileimage: async (req, res, next) => {
    try {
      //1. get current profile image
      let get = await model.customer.findAll({
        where: {
          uuid: req.decript.uuid,
        },
        attributes: ["profileImage"],
      });
      console.log(
        "ini isi dari get image_profile updateprofileimage: ",
        get[0].dataValues.profileImage
      );
      //2. if old image exists, delete old replace with new
      if (
        fs.existsSync(`./src/public${get[0].dataValues.profileImage}`) &&
        !get[0].dataValues.profileImage.includes("default")
      ) {
        fs.unlinkSync(`./src/public${get[0].dataValues.profileImage}`);
      }
      console.log("test");
      //3. save new image
      await model.customer.update(
        {
          profileImage: `/profileImage/${req.files[0]?.filename}`,
        },
        {
          where: { uuid: req.decript.uuid },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Profile photo changed ✅",
        profileImage: `/profileImage/${req.files[0]?.filename}`,
      });
    } catch (error) {
      //delete image if encountered error
      fs.unlinkSync(`./src/public/profileImage/${req.files[0].filename}`);
      console.log(error);
      next(error);
    }
  },

  getUserAddress: async (req, res, next) => {
    try {
      // find user id
      let user = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });

      let primaryAddress = await model.address.findAll({
        where: {
          customerId: user.dataValues.id,
          isPrimary: 1
        },
      })

      let data = await model.address.findAll({
        where: {
          customerId: user.dataValues.id,
        },
      });

      return res.status(200).send({
        user: user,
        data: data,
        primaryAddress: primaryAddress
      });
    } catch (error) {
      next(error);
    }
  },

  setPrimary: async (req, res, next) => {
    try {
      let getcustomer = await model.customer.findAll({
        where: {
          uuid: req.decript.uuid,
        },
      });
      let customerid = getcustomer[0].dataValues.id;

      await model.address.update({
        isPrimary: 0
      }, {
        where: {
          customerId: customerid
        }
      })

      await model.address.update({
        isPrimary: 1
      }, {
        where: {
          id: parseInt(req.body.id)
        }
      })

      return res.status(200).send({
        status: true,
        message: `primariy address has changed`
      })

    } catch (error) {
      console.log(error);
      next(error)
    }
  }
};
