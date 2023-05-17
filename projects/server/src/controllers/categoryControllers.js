const sequelize = require("sequelize");
const model = require("../models");

module.exports = {
  addCategory: async (req, res, next) => {
    try {
      let cek = await model.category.findAll({
        where: {
          type: req.body.name,
        },
      });
      // console.log(`cek`, cek);

      if (cek.length == 0) {
        // console.log(`req.body`, req.body);

        let addCategory = await model.category.create({
          type: req.body.name,
        });
        console.log(`addCategory`, addCategory);

        res.status(200).send({
          success: true,
          message: "Category Successfully Added",
          data: addCategory,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Category Name Already exists",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getCategory: async (req, res, next) => {
    try {
      let page = req.query.page;
      let size = req.query.size;
      let sortby = req.query.sortby;
      let order = req.query.order;

      if (!page && !size && !sortby && !order) {
        let get = await model.category.findAll({
          where: {
            isDisabled: 0
          }
        });

        return res.status(200).send({
          success: true,
          data: get,
        });
      } else {
        let get = await model.category.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          where: {
            type: {
              [sequelize.Op.like]: `%${req.query.type}%`,
            },
          },
          order: [[sortby, order]],
        });

        console.log(`getCategory`, get);

        return res.status(200).send({
          data: get.rows,
          datanum: get.count,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      console.log(`req params`, req.params);
      let findCategory = await model.category.findAll({
        where: {
          id: req.params.id,
        },
      });

      console.log(findCategory);

      if (findCategory[0].dataValues.isDisabled == false) {
        let deleteCategory = await model.category.update(
          { isDisabled: 1 },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        console.log(`deleteCategory`, deleteCategory);
        res.status(200).send({
          success: true,
          message: "Category InActive ",
        });
      } else {
        let deleteCategory = await model.category.update(
          { isDisabled: 0 },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        console.log(`deleteCategory`, deleteCategory);
        res.status(200).send({
          success: true,
          message: "Category Active",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  editCategory: async (req, res, next) => {
    try {
      console.log(`ini dari req params`, req.params.id);
      let cekCategory = await model.category.findAll({
        where: {
          type: req.body.type,
        },
      });
      console.log(`ini cekCategory`, cekCategory);

      if (cekCategory.length == 0) {
        let editCategory = await model.category.update(
          {
            type: req.body.type,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        // console.log(editCategory);

        return res.status(200).send({
          success: true,
          message: "Category Successfully Updated",
          data: editCategory,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Category Name Already Exists",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
