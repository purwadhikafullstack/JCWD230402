const sequelize = require("sequelize");
const model = require("../models");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

function formating(params) {
  let total = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(params);

  return total;
}

module.exports = {
  allProduct: async (req, res, next) => {
    try {
      let { page, size, sortby, order } = req.query;

      let get = await model.product.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        attributes: { exclude: ["id"] },
        where: {
          isDisabled: false,
          name: {
            [sequelize.Op.like]: `%${req.query.name}%`,
          },
        },
        include: [
          {
            model: model.category,
            attributes: ["type"],
          },
          {
            model: model.type,

            attributes: ["id", "price", "discount", "discountedPrice"],
          },
        ],
        order:
          sortby === "discountedPrice"
            ? [[{ model: model.type }, "discountedPrice", order]]
            : [[sortby, order]],
      });

      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = ", get);

      return res.status(200).send({
        data: get.rows,
        datanum: get.count,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  oneProduct: async (req, res, next) => {
    try {
      let findByName = await model.product.findOne({
        attributes: ["id", "name"],
        where: { name: req.query.name },
      });
      // console.log("find data by prod name", findByName.dataValues);

      let findType = await model.type.findAll({
        where: {
          productId: findByName.dataValues.id,
          statusId: { [sequelize.Op.ne]: 5 },
        },
        attributes: ["price", "discount", "discountedPrice", "stock"],
        include: [
          {
            model: model.product,
            include: [
              { model: model.picture, attributes: ["picture"] },
              { model: model.category, attributes: ["type"] },
            ],
            attributes: { exclude: ["id", "isDisabled"] },
            where: {
              isDisabled: { [sequelize.Op.ne]: true },
            },
          },
        ],
      });
      console.log("find type", findType);

      return res.status(200).send({ data: findType });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  checkColor: async (req, res, next) => {
    try {
      // cari id product pake product name
      let findByName = await model.product.findOne({
        attributes: ["id"],
        where: { name: req.query.name },
      });

      let findType = await model.type.findAll({
        where: {
          productId: findByName.dataValues.id,
          statusId: { [sequelize.Op.ne]: 5 },
        },
        attributes: ["colorId", "discount", "stock", "statusId"],
        include: [
          {
            model: model.color,
            attributes: ["id", "color", "hexCode"],
          },
        ],
      });

      let uniqueColors = [...new Set(findType.map((item) => item.colorId))];
      let uniqueFindType = uniqueColors.map((colorId) => {
        return findType.find((item) => item.colorId === colorId);
      });

      res.status(200).send({ data: uniqueFindType });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  checkMemory: async (req, res, next) => {
    try {
      let findByName = await model.product.findOne({
        attributes: ["id"],
        where: { name: req.query.name },
      });

      let findType = await model.type.findAll({
        where: {
          productId: findByName.dataValues.id,
          colorId: req.query.colorId,
          statusId: { [sequelize.Op.ne]: 5 },
        },
        attributes: ["statusId", "discount", "memoryId"],
        include: [
          {
            model: model.memory,
            attributes: ["id", "memory"],
          },
        ],
      });

      let uniqueMemory = [...new Set(findType.map((item) => item.memoryId))];
      let uniqueFindType = uniqueMemory.map((memoryId) => {
        return findType.find((item) => item.memoryId === memoryId);
      });
      res.status(200).send({ data: uniqueFindType });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  checkPrice: async (req, res, next) => {
    try {
      let findByName = await model.product.findOne({
        attributes: ["id"],
        where: { name: req.query.name },
      });

      let findType = await model.type.findAll({
        where: {
          [sequelize.Op.and]: [
            { productId: findByName.dataValues.id },
            { colorId: req.query.colorId },
            { memoryId: req.query.memoryId },
            { statusId: { [sequelize.Op.notIn]: [3, 5] } },
          ],
        },
        attributes: [
          "price",
          "discountedPrice",
          "discount",
          "stock",
          "statusId",
        ],
      });

      let finalstock = 0;
      findType.forEach((val) => {
        finalstock = finalstock + val.dataValues.stock;
      });

      // console.log(formating(findType[0].dataValues.discountedPrice));

      res.status(200).send({
        data: findType,
        stock: finalstock,
        formatedPrice: formating(findType[0].dataValues.price),
        formatedDiscount: formating(findType[0].dataValues.discountedPrice),
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addToCart: async (req, res, next) => {
    try {
      const findCustomer = await model.customer.findOne({
        attributes: ["id"],
        where: {
          email: req.body.email,
        },
      });
      const findproduct = await model.product.findOne({
        attributes: ["id"],
        where: {
          name: req.body.product,
        },
      });
      const customerId = findCustomer.dataValues.id;
      const productId = findproduct.dataValues.id;

      const findtype = await model.type.findAll({
        where: {
          colorId: req.body.color,
          memoryId: req.body.memory,
          productId: productId,
          statusId: 4,
          stock: {
            [sequelize.Op.ne]: 0,
          },
        },
        order: [["id", "ASC"]],
      });

      if (findtype.length !== 0) {
        let checkCart = await model.cart.findAll({
          where: {
            [sequelize.Op.and]: [
              { productId: productId },
              { colorId: req.body.color },
              { memoryId: req.body.memory },
              { customerId: customerId },
            ],
          },
        });

        if (checkCart.length !== 0) {
          // if cart sudah ada item yg sma
          let { id, totalQty } = checkCart[0].dataValues;

          await model.cart.update(
            {
              totalQty: totalQty + req.body.qty,
            },
            {
              where: {
                id: id,
              },
            }
          );
          return res.status(200).send({ update_success: true });
        } else {
          // if cart blom ada item yg sma
          let createCart = await model.cart.create({
            totalQty: req.body.qty,
            productId: productId,
            colorId: req.body.color,
            memoryId: req.body.memory,
            customerId: customerId,
          });

          return res.status(200).send({ data: createCart });
        }
      } else {
        // if checktype gagal
        return res
          .status(400)
          .send({ success: false, message: "Item currently out of stock" });
      }

      // const findtype = await model.type.findAll({
      //   where: {
      //     colorId: req.body.color,
      //     memoryId: req.body.memory,
      //     productId: productId,
      //     statusId: 4,
      //     stock: {
      //       [sequelize.Op.ne]: 0,
      //     },
      //   },
      //   order: [["id", "ASC"]],
      // });

      // if (findtype.length !== 0) {
      //   const { discountedPrice, id } = findtype[0].dataValues;

      //   await model.cart.create({
      //     priceOnDate: discountedPrice,
      //     totalQty: req.body.qty,
      //     totalPrice: discountedPrice * req.body.qty,
      //     typeId: id,
      //     customerId: customerId,
      //   });

      //   return res.status(200).send({ success: true });
      // } else {
      //   return res
      //     .status(400)
      //     .send({ success: false, message: "Item currently out of stock" });
      // }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      let findCustomerId = await model.customer.findOne({
        where: {
          email: req.query.email,
        },
      });

      let findcart = await model.cart.findAndCountAll({
        where: {
          customerId: findCustomerId.dataValues.id,
        },
      });

      res.status(200).send({ data: findcart.rows, datanum: findcart.count });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
