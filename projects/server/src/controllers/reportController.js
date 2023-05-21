const model = require("../models");
const sequelize = require("sequelize");

module.exports = {
  getSummary: async (req, res, next) => {
    try {
      let startDate = new Date(req.query.startdate);
      startDate.setDate(startDate.getDate() - 1);

      let endDate = new Date(req.query.enddate);
      endDate.setDate(endDate.getDate() + 1);

      const getSummary = await model.stockMutation.findAll({
        where: {
          creatorId: req.query.warehouse,
          createdAt: {
            [sequelize.Op.gte]: startDate,
            [sequelize.Op.lte]: endDate,
          },
        },
        attributes: ["creatorId", "createdAt", "subtraction", "addition"],
        order: [["createdAt", "DESC"]],
      });

      // getType for final stock count
      const getType = await model.type.findAll({
        where: {
          warehouseId: req.query.warehouse,
        },

        attributes: [
          [sequelize.fn("SUM", sequelize.col("stock")), "totalStock"],
          "warehouseId",
        ],
      });

      let totalAddition = 0;
      let totalSubtraction = 0;
      let finalStock = 0;

      if (getSummary.length > 0) {
        getSummary.forEach((val) => {
          totalAddition += val.dataValues.addition;
          totalSubtraction += val.dataValues.subtraction;
        });

        finalStock =
          parseInt(getType[0].dataValues.totalStock) +
          parseInt(totalAddition - totalSubtraction);
      } else {
        totalAddition = "-";
        totalSubtraction = "-";
        finalStock = parseInt(getType[0].dataValues.totalStock);
      }
      return res.status(200).send({
        addition: totalAddition,
        subtraction: totalSubtraction,
        finalStock: finalStock,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllMutation: async (req, res, next) => {
    try {
      let startDate = new Date(req.query.startdate);
      startDate.setDate(startDate.getDate() - 1);

      let endDate = new Date(req.query.enddate);
      endDate.setDate(endDate.getDate() + 1);

      let { product, warehouse, orderby, page, size } = req.query;

      let whereOptions = {
        createdAt: {
          [sequelize.Op.gte]: startDate,
          [sequelize.Op.lte]: endDate,
        },
      };

      if (warehouse != 0) {
        // klo ada warehouse yg dipilih
        whereOptions.creatorId = warehouse;
      }

      let includeOptions = [
        {
          model: model.type,
          attributes: ["id"],
          include: [{ model: model.product, attributes: ["name"] }],
        },
        {
          model: model.warehouse,
          attributes: ["name"],
        },
        {
          model: model.order,
          attributes: ["uuid"],
        },
      ];

      if (product != 0) {
        // klo ada product yg dipilih
        const findProduct = await model.product.findOne({
          where: {
            uuid: product,
          },
        });

        includeOptions[0].where = {
          productId: findProduct.dataValues.id,
        };
      }

      const getChanges = await model.stockMutation.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        where: whereOptions,
        attributes: [
          "typeId",
          "initialStock",
          "addition",
          "subtraction",
          "supplierId",
          "targetId",
          "creatorId",
          "createdAt",
        ],
        include: includeOptions,
        order: [["createdAt", orderby]],
      });

      return res.status(200).send({
        changes: getChanges.rows,
        datanum: getChanges.count,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getProductList: async (req, res, next) => {
    try {
      let find = await model.product.findAll({
        where: {
          isDisabled: 0,
        },
        attributes: {
          exclude: [
            "updatedAt",
            "createdAt",
            "description",
            "productImage",
            "categoryId",
          ],
        },
      });
      res.status(200).send(find);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
