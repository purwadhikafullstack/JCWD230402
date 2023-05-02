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
  addProduct: async (req, res, next) => {
    // const ormTransaction = await model.sequelize.transaction();
    try {
      console.log(`reqbody `, req.body);
      console.log(`req.files `, req.files);
      // console.log(`reqfile `, req.body.images[0]);

      let { name, categoryId, description, variations } = JSON.parse(
        req.body.data
      );

      let cekProduk = await model.product.findAll({
        where: {
          name: name,
        },
      });

      // console.log(`cekproduk`, cekProduk);

      if (cekProduk.length == 0) {
        //CASE = produk blm ada sama sekali, buat produk baru di table produk, dan variant di table type

        const uuid = uuidv4();

        let addProduct = await model.product.create(
          {
            uuid,
            name,
            productImage: `/imgProduct/${req.files[0]?.filename}`,
            description,
            categoryId,
          },
          {
            // transaction: ormTransaction,
          }
        );

        variations.forEach(async (variant) => {
          console.log(`variant`, variant);

          await model.type.create(
            {
              productId: addProduct.dataValues.id,
              colorId: variant.colorId.value,
              memoryId: variant.memoryId.value,
              stock: variant.stock,
              price: variant.price,
              discountedPrice: variant.price,
              warehouseId: variant.warehouseId,
              statusId: 4,
            },
            {
              // transaction: ormTransaction,
            }
          );
        });
        // await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "produk added",
        });
      } else if (cekProduk.length != 0) {
        // CASE = kalo produk sudah ada di table produk, dan mau tambah variant
        let productId = await model.product.findAll({
          where: {
            name,
          },
          attributes: ["id"],
        });
        // console.log(`productId`, productId);

        let newArr = [];

        for (let i = 0; i < variations.length; i++) {
          let cektype = await model.type.findAll({
            where: {
              [sequelize.Op.and]: [
                { productId: productId[0].dataValues.id },
                { colorId: variations[i].colorId.value },
                { memoryId: variations[i].memoryId.value },
                { warehouseId: variations[i].warehouseId },
              ],
            },
          });
          console.log(`cektype`, cektype);

          if (cektype.length == 0) {
            // kalo variasi belum ada di database type
            newArr.push("false"); // push(false) => ke array kosong karena variasi belum pernah ada di database

            await model.type.create(
              {
                productId: productId[0].dataValues.id,
                colorId: variations[i].colorId.value,
                memoryId: variations[i].memoryId.value,
                stock: variations[i].stock,
                price: variations[i].price,
                discountedPrice: variations[i].price,
                warehouseId: variations[i].warehouseId,
                statusId: 4,
              },
              {
                // transaction: ormTransaction,
              }
            );

            // console.log(`newArr`, newArr);
          } else {
            // kalo variasi ternyata sudah ada di database type
            newArr.push("true");
            // console.log(`newArr`, newArr);
          }
        }

        // kondisi dibawah ini jalan ketika loopingan variant sudah selesai
        console.log(`hasil newArr`, newArr);
        console.log(`hasil include`, newArr.includes("false"));

        if (newArr.includes("false")) {
          console.log(`hasil include 1:`, newArr.includes("false"));

          // await ormTransaction.commit();
          return res.status(200).send({
            success: true,
            message: "variasi berhasil ditambah, duplikasi tidak dibikin",
          });
        } else {
          console.log(`hasil include 2:`, newArr.includes("false"));

          return res.status(400).send({
            success: false,
            message:
              "produk yang ingin ditambah dan semua variasinya sudah ada di database",
          });
        }
      }
    } catch (error) {
      // await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      let page = req.query.page;
      let size = req.query.size;
      let sortby = req.query.sortby;
      let order = req.query.order;

      let get = await model.product.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        where: {
          name: {
            [sequelize.Op.like]: `%${req.query.name}%`,
          },
        },
        include: [
          { model: model.category, attributes: ["type"] },
          { model: model.type, attributes: ["price"] },
        ],
        // order: [[sortby, order]],
        order: [[model.type, "price", "ASC"]],
        // order: sortby == 'product' ? [[sortby, order]] : [[model.type, sortby, order]]
      });

      console.log(`getProduct`, get);

      return res.status(200).send({
        data: get.rows,
        datanum: get.rows.length,
        // maxMin
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  editProduct: async (req, res, next) => {
    try {
      console.log(`reqbody `, JSON.parse(req.body.data));
      console.log(`req.files `, req.files);

      let { name, categoryId, description, variationsEdit } = JSON.parse(
        req.body.data
      );

      let cekProduct = await model.product.findAll({
        where: {
          id: req.query.id,
        },
      });
      console.log(`cekProduct`, cekProduct);
      // console.log(`colorId`, variationsEdit[3].colorId);
      if (cekProduct.length == 1) {
        let editProduct = await model.product.update(
          {
            name,
            categoryId,
            description,
          },
          {
            where: {
              id: req.query.id,
            },
          }
        );
        // console.log(`editProduct`, editProduct);

        let newArr = [];

        for (let i = 0; i < variationsEdit.length; i++) {
          let cektype = await model.type.findAll({
            where: {
              [sequelize.Op.and]: [
                { productId: req.query.id },
                {
                  colorId:
                    variationsEdit[i].colorId.value ||
                    variationsEdit[i].colorId,
                },
                {
                  memoryId:
                    variationsEdit[i].memoryId.value ||
                    variationsEdit[i].memoryId,
                },
                { warehouseId: variationsEdit[i].warehouseId },
              ],
            },
          });
          console.log(`cektype`, cektype);

          if (cektype.length == 0) {
            // kalo variasi belum ada di database type
            newArr.push("false"); // push(false) => ke array kosong karena variasi belum pernah ada di database

            await model.type.create(
              {
                productId: req.query.id,
                colorId: variationsEdit[i].colorId.value,
                memoryId: variationsEdit[i].memoryId.value,
                stock: variationsEdit[i].stock,
                price: variationsEdit[i].price,
                discountedPrice: variationsEdit[i].price,
                warehouseId: variationsEdit[i].warehouseId,
                statusId: 4,
              },
              {
                // transaction: ormTransaction,
              }
            );

            // console.log(`newArr`, newArr);
          } else {
            // kalo variasi ternyata sudah ada di database type
            newArr.push("true");
            // console.log(`newArr`, newArr);
          }
        }

        if (newArr.includes("false")) {
          console.log(`hasil include 1:`, newArr.includes("false"));

          // await ormTransaction.commit();
          return res.status(200).send({
            success: true,
            message: "variasi berhasil ditambah, duplikasi tidak dibikin",
          });
        } else {
          console.log(`hasil include 2:`, newArr.includes("false"));

          return res.status(400).send({
            success: false,
            message:
              "produk yang ingin ditambah dan semua variasinya sudah ada di database",
          });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      console.log(`req.params`, req.params);
      let findProduct = await model.product.findAll({
        where: {
          id: req.params.id,
        },
      });
      // console.log(findProduct);
      if (findProduct[0].dataValues.isDisabled == false) {
        let deleteProduct = await model.product.update(
          { isDisabled: 1 },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        console.log(`deleteProduct`, deleteProduct);
        res.status(200).send({
          success: true,
          message: "product disabled",
        });
      } else {
        let deleteProduct = await model.product.update(
          { isDisabled: 0 },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        console.log(`deleteProduct`, deleteProduct);
        res.status(200).send({
          success: true,
          message: "product enabled",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getVariant: async (req, res, next) => {
    try {
      if (req.query.warehouseId) {
        let get = await model.type.findAll({
          where: {
            productId: req.query.id,
            warehouseId: req.query.warehouseId,
          },
          include: [{ model: model.status, attributes: ["id", "status"] }],
        });

        res.status(200).send({
          success: true,
          data: get,
        });
      } else {
        let get = await model.type.findAll({
          where: {
            productId: req.query.id,
          },
          include: [{ model: model.status, attributes: ["id", "status"] }],
        });

        res.status(200).send({
          success: true,
          data: get,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  editVariant: async (req, res, next) => {
    try {
      console.log(`req.params`, req.params);
      console.log(`req.body`, req.body);

      let findStock = await model.type.findOne({
        where: {
          id: req.params.id
        }
      })

      console.log(`findStock`, findStock);
      if (req.body.stock - findStock.dataValues.stock < 0) {
        let stockMutation = await model.stockMutation.create({
          typeId: req.params.id,
          subtraction: Math.abs(req.body.stock - findStock.dataValues.stock),
          statusId: 7,
          onLocation: 1,
          requestId: 3,
        })
        console.log(`stockMutation`, stockMutation);
      } else {
        let stockMutation = await model.stockMutation.create({
          typeId: req.params.id,
          addition: Math.abs(req.body.stock - findStock.dataValues.stock),
          statusId: 7,
          onLocation: 1,
          requestId: 3,
        })
        console.log(`stockMutation`, stockMutation);
      }
      
      let editVariant = await model.type.update(
        {
          price: req.body.price,
          stock: req.body.stock,
          discount: req.body.discount / 100,
          discountedPrice:
            req.body.price - (req.body.price * req.body.discount) / 100,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      console.log("editVariant", editVariant);

      return res.status(200).send({
        success: true,
        message: "variant update",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getPrice: async (req, res, next) => {
    try {
      console.log(`req.query`, req.query);
      let get = await model.type.findAll({
        where: {
          productId: req.query.id,
        },
        attributes: ["price"],
        order: [["price", "ASC"]],
      });

      // console.log(`get`, get);

      res.status(200).send(get);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getColor: async (req, res, next) => {
    try {
      let get = await model.color.findAll({
        attributes: [
          ["id", "value"],
          ["color", "label"],
        ],
      });

      res.status(200).send({
        status: true,
        data: get,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  addColor: async (req, res, next) => {
    try {
      let cek = await model.color.findAll({
        where: {
          color: req.body.color,
        },
      });

      if (cek.length == 0) {
        let addColor = await model.color.create({
          color: req.body.color,
        });

        // console.log(`addcolor`, addColor);

        res.status(200).send({
          success: true,
          message: "color added",
          data: addColor,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "color existed",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getMemory: async (req, res, next) => {
    try {
      let get = await model.memory.findAll({
        attributes: [
          ["id", "value"],
          ["memory", "label"],
        ],
      });

      res.status(200).send({
        status: true,
        data: get,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  addMemory: async (req, res, next) => {
    try {
      let cek = await model.memory.findAll({
        where: {
          memory: req.body.memory,
        },
      });

      if (cek.length == 0) {
        let addMemory = await model.memory.create({
          memory: req.body.memory,
        });

        // console.log(`addcolor`, addColor);

        res.status(200).send({
          success: true,
          message: "memory added",
          data: addMemory,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "memory existed",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

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
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = ", get);
      const counter = await model.product.count({
        where: {
          isDisabled: false,
        },
      });

      console.log(counter);

      return res.status(200).send({
        data: get.rows,
        datanum: counter,
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
        attributes: [
          [
            sequelize.literal(
              `CASE WHEN EXISTS(SELECT 1 FROM types WHERE productId = ${findByName.dataValues.id} AND colorId = ${req.query.colorId} AND statusId = 4) THEN 4 ELSE type.statusId END`
            ),
            "statusId",
          ],
          "discount",
          "memoryId",
          [
            sequelize.literal(
              "SUM(CASE WHEN statusId <> 3 THEN stock - booked ELSE 0 END)"
            ),
            "available",
          ],
        ],
        where: {
          productId: findByName.dataValues.id,
          colorId: req.query.colorId,
          statusId: { [sequelize.Op.ne]: 5 },
        },

        include: [
          {
            model: model.memory,
            attributes: ["id", "memory"],
          },
        ],

        group: ["memory.id"],
      });

      res.status(200).send({ data: findType });
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
          [sequelize.literal("stock - booked"), "available"],
        ],
      });

      let finalstock = 0;
      findType.forEach((val) => {
        finalstock = finalstock + val.dataValues.available;
      });

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
        where: {
          uuid: req.decript.uuid,
        },
      });
      const customerId = findCustomer.dataValues.id;

      // Check if cart is at limit
      const cartlimit = await model.cart.count({
        where: {
          customerId: customerId,
        },
      });

      if (cartlimit >= 5) {
        return res.status(400).send({
          success: false,
          message:
            "Your cart is full. Limit is 5 items, please remove some items. ",
        });
      } else {
        const findproduct = await model.product.findOne({
          attributes: ["id"],
          where: {
            name: req.body.product,
          },
        });

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
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      // find customer id based on email
      let findCustomerId = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });

      // find item number for pagination
      const count = await model.cart.count({
        where: {
          customerId: findCustomerId.dataValues.id,
        },
      });

      const cart = await model.cart.findAll({
        where: {
          customerId: findCustomerId.dataValues.id,
        },
        sort: [["createdAt", "ASC"]],
        include: [
          {
            model: model.product,
            attributes: {
              exclude: [
                "id",
                "isDisabled",
                "createdAt",
                "updatedAt",
                "description",
              ],
            },
            include: [{ model: model.category, attributes: ["type"] }],
          },
          { model: model.color, attributes: ["color"] },
          { model: model.memory, attributes: ["memory"] },
        ],
      });

      let tempArr = [];
      for (let i = 0; i < cart.length; i++) {
        find = await model.type.findAll({
          attributes: [
            "id",
            "price",
            "discount",
            "discountedPrice",
            "colorId",
            "memoryId",
            "productId",
            [sequelize.literal("stock - booked"), "available"],
          ],

          where: {
            [sequelize.Op.and]: [
              { productId: cart[i].dataValues.productId },
              { colorId: cart[i].dataValues.colorId },
              { memoryId: cart[i].dataValues.memoryId },
            ],
            statusId: 4,
          },
          having: sequelize.literal("available > 0"),
          limit: 1,
        });

        tempArr.push(find);
      }

      res.status(200).send({
        data: cart,
        datanum: count,
        pricing: tempArr,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteOneFromCart: async (req, res, next) => {
    try {
      const findCustomer = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });

      await model.cart.destroy({
        where: {
          customerId: findCustomer.dataValues.id,
          id: req.params.id,
        },
      });
      res.status(200).send({ success: true });
    } catch (error) {
      console.log("error delete from cart", error);
      next(error);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      const findCustomer = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });

      await model.cart.destroy({
        where: {
          customerId: findCustomer.dataValues.id,
        },
      });
      res.status(200).send({ success: true });
    } catch (error) {
      console.log("error deleteAll", error);
      next(error);
    }
  },
  minusItem: async (req, res, next) => {
    try {
      let findCart = await model.cart.findOne({
        where: {
          id: req.body.id,
        },
      });

      if (findCart.dataValues.totalQty === 1) {
        await model.cart.destroy({
          where: {
            id: req.body.id,
          },
        });

        res.status(200).send({ delete: true });
      } else {
        await model.cart.update(
          {
            totalQty: findCart.dataValues.totalQty - 1,
          },
          {
            where: { id: req.body.id },
          }
        );

        res.status(200).send({ update: true });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addItem: async (req, res, next) => {
    try {
      let findCart = await model.cart.findOne({
        where: {
          id: req.body.id,
        },
      });

      await model.cart.update(
        { totalQty: findCart.dataValues.totalQty + 1 },
        {
          where: {
            id: req.body.id,
          },
        }
      );

      return res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
