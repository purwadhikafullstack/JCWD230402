const sequelize = require("sequelize");
const model = require("../models");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../helpers/nodemailer");
const fs = require("fs");

module.exports = {
  createOrder: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      // find customerId yg lagi login
      const findCustomerId = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });
      const customerId = findCustomerId.dataValues.id;

      // cari data di shopping cart yg punya customerId yang sama dengan yg lagi login
      const cart = await model.cart.findAll({
        where: {
          customerId: customerId,
        },
        sort: [["createdAt", "ASC"]],
      });

      // cari info warehouse yg pling dkat dgan user
      const getWarehouse = await model.warehouse.findOne(
        {
          where: {
            uuid: req.body.warehousechoice,
          },
        },
        {
          attributes: ["id", "name", "location"],
        }
      );

      const warehouseLocation = getWarehouse.dataValues.location;
      const chosenWarehouseId = getWarehouse.dataValues.id;

      let typeArr = [];
      // loop buat mencari type type yg memenuhi syarat dri cart di simpan di typeArr
      for (let i = 0; i < cart.length; i++) {
        let typefind = await model.type.findAll({
          attributes: [
            "id",
            "price",
            "discount",
            "discountedPrice",
            "colorId",
            "memoryId",
            "productId",
            "warehouseId",
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
          include: [
            {
              model: model.warehouse,
              attributes: ["id", "name", "location", "province_id", "city_id"],
            },
          ],

          having: sequelize.literal(`available > 0`),
        });

        typeArr.push(typefind);
      }

      let sums = []; // total available per type - totalQty per item di cart
      let checkNegative = []; // jika sums ada yg negatif maka true else false
      let warehouseIdArr = []; // nampung smua warehouseId per array
      for (let i = 0; i < typeArr.length; i++) {
        let tempObj = {};
        let tempArr = [];
        let result = 0;

        for (let j = 0; j < typeArr[i].length; j++) {
          // console.log(`tttt`, typeArr[i][j].dataValues);
          result += typeArr[i][j].dataValues.available;
          tempArr.push(typeArr[i][j].dataValues.warehouse.dataValues);
        }
        result = result - cart[i].dataValues.totalQty;

        if (result > 0) {
          checkNegative.push(false);
        } else {
          checkNegative.push(true);
        }

        tempObj.colorId = typeArr[i][0].dataValues.colorId;
        tempObj.memoryId = typeArr[i][0].dataValues.memoryId;
        tempObj.productId = typeArr[i][0].dataValues.productId;
        tempObj.result = result;

        sums.push(tempObj);
        warehouseIdArr.push(tempArr);
      }

      if (checkNegative.includes(true)) {
        // jika total available per type - totalQty per item di cart ada yg negatif

        for (let i = 0; i < sums.length; i++) {
          if (sums[i].result < 0) {
            await model.cart.destroy(
              {
                where: {
                  customerId: customerId,
                  colorId: sums[i].colorId,
                  memoryId: sums[i].memoryId,
                  productId: sums[i].productId,
                },
              },
              {
                transaction: ormTransaction,
              }
            );
          }
        }

        await ormTransaction.commit();
        return res
          .status(400)
          .send({ message: "one or more items are no longer available" });
      } else {
        // jika total available per type - totalQty per item di cart tidak ada yg negatif
        const uuid = uuidv4();

        const order = await model.order.create(
          {
            uuid,
            customerId: customerId,
            deliveryFee: req.body.deliveryFee,
            finalPrice: req.body.finalPrice,
            warehouseId: chosenWarehouseId,
            statusId: 9,
          },
          {
            transaction: ormTransaction,
          }
        );

        // 1. bandingkan jarak smua warehouseId yang typenya memenuhi syarat dri cart
        let allDistance = [];
        for (let i = 0; i < warehouseIdArr.length; i++) {
          let tempArr = [];
          for (let j = 0; j < warehouseIdArr[i].length; j++) {
            let tempObj = {};
            const R = 6371; // km (change this constant to get miles)
            let lat2 = warehouseIdArr[i][j].location.split(",")[0];
            let lon2 = warehouseIdArr[i][j].location.split(",")[1];
            let lat1 = warehouseLocation.split(",")[0];
            let lon1 = warehouseLocation.split(",")[1];

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

            tempObj.id = warehouseIdArr[i][j].id;
            tempObj.name = warehouseIdArr[i][j].name;
            tempObj.distance = d;
            tempArr.push(tempObj);
          }

          allDistance.push(tempArr);

          allDistance[i].sort((a, b) => {
            return a.distance - b.distance;
          });

          // untuk nyari value booked dri database yg bawa variasi, sbelum di update
          const findbooked = await model.type.findAll({
            where: {
              warehouseId: allDistance[i][0].id,
              colorId: cart[i].dataValues.colorId,
              memoryId: cart[i].dataValues.memoryId,
              productId: cart[i].dataValues.productId,
            },
          });

          const delivererType = await model.type.findOne({
            where: {
              warehouseId: chosenWarehouseId,
              colorId: cart[i].dataValues.colorId,
              memoryId: cart[i].dataValues.memoryId,
              productId: cart[i].dataValues.productId,
            },
          });

          // case 1: jika warehouse yg pling dkat dengan customer === warehouse yg membawa variant item tsb
          if (allDistance[i][0].id == chosenWarehouseId) {
            // apakah qtynya cukup ?
            if (
              cart[i].dataValues.totalQty >
              findbooked[0].dataValues.stock - findbooked[0].dataValues.booked
            ) {
              // case 1-1: jika di warehouse pling dkat, availablenya tidak memenuhi qty yg diorder oleh customer
              // console.log(
              //   "warehouse yg pling dkat, availablenya kurang dri qty yg di order oleh customer"
              // );

              // update cart utk warehouse yg nganter diluar loop - krena cman skali saja dilakuinnya
              await model.cart.update(
                {
                  totalQty:
                    cart[i].dataValues.totalQty -
                    (delivererType.dataValues.stock -
                      delivererType.dataValues.booked),
                },
                {
                  where: {
                    id: cart[i].dataValues.id,
                  },
                },
                {
                  transaction: ormTransaction,
                }
              );

              for (let k = 0; k < allDistance[i].length; k++) {
                const updatedCart = await model.cart.findAll({
                  where: {
                    customerId: customerId,
                  },
                  sort: [["createdAt", "ASC"]],
                });

                const findInfo = await model.type.findAll({
                  where: {
                    warehouseId: allDistance[i][k + 1].id,
                    colorId: cart[i].dataValues.colorId,
                    memoryId: cart[i].dataValues.memoryId,
                    productId: cart[i].dataValues.productId,
                  },
                });

                const updatedDelivererType = await model.type.findOne({
                  where: {
                    warehouseId: chosenWarehouseId,
                    colorId: cart[i].dataValues.colorId,
                    memoryId: cart[i].dataValues.memoryId,
                    productId: cart[i].dataValues.productId,
                  },
                });

                if (
                  updatedCart[i].dataValues.totalQty >
                  findInfo[0].dataValues.stock - findInfo[0].dataValues.booked
                ) {
                  //  bikin stock mutation utk dri warehouse terdekat meminta warehouse yg punya item tsb
                  await model.stockmutation.create(
                    {
                      typeId: findInfo[0].dataValues.id,
                      initialStock: updatedDelivererType.dataValues.stock,
                      addition:
                        findInfo[0].dataValues.stock -
                        findInfo[0].dataValues.booked,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 0,
                      requestId: 1,
                      creatorId: chosenWarehouseId,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                  await model.stockmutation.create(
                    {
                      typeId: findInfo[0].dataValues.id,
                      initialStock: findInfo[0].dataValues.stock,
                      subtraction:
                        findInfo[0].dataValues.stock -
                        findInfo[0].dataValues.booked,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 1,
                      requestId: 2,
                      creatorId: findInfo[0].dataValues.warehouseId,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // update stock cart
                  await model.cart.update(
                    {
                      totalQty:
                        updatedCart[i].dataValues.totalQty -
                        (findInfo[0].dataValues.stock -
                          findInfo[0].dataValues.booked),
                    },
                    {
                      where: {
                        id: updatedCart[i].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  //  update stock supplier
                  await model.type.update(
                    {
                      stock:
                        findInfo[0].dataValues.stock -
                        (findInfo[0].dataValues.stock -
                          findInfo[0].dataValues.booked),
                    },
                    {
                      where: {
                        id: findInfo[0].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );
                } else if (updatedCart[i].dataValues.totalQty > 0) {
                  //  bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                  await model.stockmutation.create(
                    {
                      typeId: findInfo[0].dataValues.id,
                      initialStock: updatedDelivererType.dataValues.stock,
                      addition: updatedCart[i].dataValues.totalQty,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 0,
                      requestId: 1,
                      creatorId: chosenWarehouseId,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                  await model.stockmutation.create(
                    {
                      typeId: findInfo[0].dataValues.id,
                      initialStock: findInfo[0].dataValues.stock,
                      subtraction: updatedCart[i].dataValues.totalQty,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 1,
                      requestId: 2,
                      creatorId: findInfo[0].dataValues.warehouseId,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  //  update stock supplier
                  await model.type.update(
                    {
                      stock:
                        findInfo[0].dataValues.stock -
                        updatedCart[i].dataValues.totalQty,
                    },
                    {
                      where: {
                        id: findInfo[0].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // update type di warehouse yg nganter
                  await model.type.update(
                    {
                      stock:
                        findbooked[0].dataValues.booked +
                        cart[i].dataValues.totalQty,
                      booked:
                        findbooked[0].dataValues.booked +
                        cart[i].dataValues.totalQty,
                    },
                    {
                      where: {
                        id: findbooked[0].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // bikin order detail
                  await model.orderdetail.create(
                    {
                      priceOnDate: findbooked[0].dataValues.discountedPrice,
                      totalQty: cart[i].dataValues.totalQty,
                      totalPrice:
                        findbooked[0].dataValues.discountedPrice *
                        cart[i].dataValues.totalQty,
                      typeId: findbooked[0].dataValues.id,
                      warehouseId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // delete entry di cart buat order tsb.
                  await model.cart.destroy(
                    {
                      where: {
                        customerId: customerId,
                        colorId: cart[i].dataValues.colorId,
                        memoryId: cart[i].dataValues.memoryId,
                        productId: cart[i].dataValues.productId,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  break;
                }
              }
            } else {
              // case 1-2: jika di warehouse pling dkat, availablenya memenuhi qty yg diorder oleh customer
              // console.log(
              //   "warehouse pling dkat, availablenya memenuhi qty yg diorder oleh customer"
              // );
              // Step 1. ubah jumlah booked di warehouse yg ngirim.
              await model.type.update(
                {
                  booked:
                    findbooked[0].dataValues.booked +
                    cart[i].dataValues.totalQty,
                },
                {
                  where: {
                    id: findbooked[0].dataValues.id,
                  },
                },
                {
                  transaction: ormTransaction,
                }
              );

              // Step 2. bikin order detail untuk tiap product yg di order customer.
              await model.orderdetail.create(
                {
                  priceOnDate: findbooked[0].dataValues.discountedPrice,
                  totalQty: cart[i].dataValues.totalQty,
                  totalPrice:
                    findbooked[0].dataValues.discountedPrice *
                    cart[i].dataValues.totalQty,
                  typeId: findbooked[0].dataValues.id,
                  warehouseId: chosenWarehouseId,
                  orderId: order.dataValues.id,
                },
                {
                  transaction: ormTransaction,
                }
              );

              // Step 3. delete entry di cart buat order tsb.
              await model.cart.destroy(
                {
                  where: {
                    customerId: customerId,
                    colorId: cart[i].dataValues.colorId,
                    memoryId: cart[i].dataValues.memoryId,
                    productId: cart[i].dataValues.productId,
                  },
                },
                {
                  transaction: ormTransaction,
                }
              );
            }
          }

          // ===================================================================================================================================================

          // case 2:  jika warehouse yg pling dkat dengan customer tidak bertanggung jawab untuk mengantar ke customer
          else {
            // case 2-1:  warehouse pertama tidak memenuhi kebutuhan customer
            if (
              cart[i].dataValues.totalQty >
              findbooked[0].dataValues.stock - findbooked[0].dataValues.booked
            ) {
              // console.log("w2 tidak memenuhi kebutuhan -- loop");

              for (let k = 0; k < allDistance[i].length; k++) {
                const updatedCart = await model.cart.findAll({
                  where: {
                    customerId: customerId,
                  },
                  sort: [["createdAt", "ASC"]],
                });

                const findInfo = await model.type.findAll({
                  where: {
                    warehouseId: allDistance[i][k].id,
                    colorId: cart[i].dataValues.colorId,
                    memoryId: cart[i].dataValues.memoryId,
                    productId: cart[i].dataValues.productId,
                  },
                });

                if (
                  updatedCart[i].dataValues.totalQty >
                  findInfo[0].dataValues.stock - findInfo[0].dataValues.booked
                ) {
                  //  bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                  await model.stockmutation.create(
                    {
                      typeId: findInfo[0].dataValues.id,
                      addition:
                        findInfo[0].dataValues.stock -
                        findInfo[0].dataValues.booked,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 0,
                      requestId: 1,
                      creatorId: chosenWarehouseId,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                  await model.stockmutation.create(
                    {
                      typeId: findInfo[0].dataValues.id,
                      initialStock: findInfo[0].dataValues.stock,
                      subtraction:
                        findInfo[0].dataValues.stock -
                        findInfo[0].dataValues.booked,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 1,
                      requestId: 2,
                      creatorId: findInfo[0].dataValues.warehouseId,
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // update stock cart
                  await model.cart.update(
                    {
                      totalQty:
                        updatedCart[i].dataValues.totalQty -
                        (findInfo[0].dataValues.stock -
                          findInfo[0].dataValues.booked),
                    },
                    {
                      where: {
                        id: updatedCart[i].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  //  update stock supplier
                  await model.type.update(
                    {
                      stock:
                        findInfo[0].dataValues.stock -
                        (findInfo[0].dataValues.stock -
                          findInfo[0].dataValues.booked),
                    },
                    {
                      where: {
                        id: findInfo[0].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );
                } else if (updatedCart[i].dataValues.totalQty > 0) {
                  //  update stock supplier
                  await model.type.update(
                    {
                      stock:
                        findInfo[0].dataValues.stock -
                        updatedCart[i].dataValues.totalQty,
                    },
                    {
                      where: {
                        id: findInfo[0].dataValues.id,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );

                  // check dlu typenya yg warehouseId == chosenWarehouseId dan bawa item yg user mau
                  const checkType = await model.type.findOne({
                    where: {
                      colorId: cart[i].dataValues.colorId,
                      memoryId: cart[i].dataValues.memoryId,
                      productId: cart[i].dataValues.productId,
                      warehouseId: chosenWarehouseId,
                    },
                  });

                  if (checkType) {
                    // klo ada

                    //  bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                    await model.stockmutation.create(
                      {
                        typeId: findInfo[0].dataValues.id,
                        initialStock: checkType.dataValues.stock,
                        addition: updatedCart[i].dataValues.totalQty,
                        supplierId: findInfo[0].dataValues.warehouseId,
                        targetId: chosenWarehouseId,
                        orderId: order.dataValues.id,
                        statusId: 9,
                        onLocation: 0,
                        requestId: 1,
                        creatorId: chosenWarehouseId,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );

                    // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                    await model.stockmutation.create(
                      {
                        typeId: findInfo[0].dataValues.id,
                        initialStock: findInfo[0].dataValues.stock,
                        subtraction: updatedCart[i].dataValues.totalQty,
                        supplierId: findInfo[0].dataValues.warehouseId,
                        targetId: chosenWarehouseId,
                        orderId: order.dataValues.id,
                        statusId: 9,
                        onLocation: 1,
                        requestId: 2,
                        creatorId: findInfo[0].dataValues.warehouseId,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );

                    // update type
                    await model.type.update(
                      {
                        stock:
                          checkType.dataValues.stock +
                          cart[i].dataValues.totalQty,
                        booked:
                          checkType.dataValues.booked +
                          cart[i].dataValues.totalQty,
                      },
                      {
                        where: {
                          id: checkType.dataValues.id,
                        },
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );

                    // bikin order detail
                    await model.orderdetail.create(
                      {
                        priceOnDate: findbooked[0].dataValues.discountedPrice,
                        totalQty: cart[i].dataValues.totalQty,
                        totalPrice:
                          findbooked[0].dataValues.discountedPrice *
                          cart[i].dataValues.totalQty,
                        typeId: checkType.dataValues.id,
                        warehouseId: chosenWarehouseId,
                        orderId: order.dataValues.id,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );
                  } else {
                    // klo tidak ada

                    //  bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                    await model.stockmutation.create(
                      {
                        typeId: findInfo[0].dataValues.id,

                        addition: updatedCart[i].dataValues.totalQty,
                        supplierId: findInfo[0].dataValues.warehouseId,
                        targetId: chosenWarehouseId,
                        orderId: order.dataValues.id,
                        statusId: 9,
                        onLocation: 0,
                        requestId: 1,
                        creatorId: chosenWarehouseId,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );

                    // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                    await model.stockmutation.create(
                      {
                        typeId: findInfo[0].dataValues.id,
                        initialStock: findInfo[0].dataValues.stock,
                        subtraction: updatedCart[i].dataValues.totalQty,
                        supplierId: findInfo[0].dataValues.warehouseId,
                        targetId: chosenWarehouseId,
                        orderId: order.dataValues.id,
                        statusId: 9,
                        onLocation: 1,
                        requestId: 2,
                        creatorId: findInfo[0].dataValues.warehouseId,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );

                    // bikin type di di warehouse terdekat
                    const createType = await model.type.create(
                      {
                        price: findbooked[0].dataValues.price,
                        discount: findbooked[0].dataValues.discount,
                        discountedPrice:
                          findbooked[0].dataValues.discountedPrice,
                        stock: cart[i].dataValues.totalQty,
                        booked: cart[i].dataValues.totalQty,
                        colorId: cart[i].dataValues.colorId,
                        memoryId: cart[i].dataValues.memoryId,
                        productId: cart[i].dataValues.productId,
                        warehouseId: chosenWarehouseId,
                        statusId: 3,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );

                    // bikin order detail
                    await model.orderdetail.create(
                      {
                        priceOnDate: findbooked[0].dataValues.discountedPrice,
                        totalQty: cart[i].dataValues.totalQty,
                        totalPrice:
                          findbooked[0].dataValues.discountedPrice *
                          cart[i].dataValues.totalQty,
                        typeId: createType.dataValues.id,
                        warehouseId: chosenWarehouseId,
                        orderId: order.dataValues.id,
                      },
                      {
                        transaction: ormTransaction,
                      }
                    );
                  }

                  // delete entry di cart buat order tsb.
                  await model.cart.destroy(
                    {
                      where: {
                        customerId: customerId,
                        colorId: cart[i].dataValues.colorId,
                        memoryId: cart[i].dataValues.memoryId,
                        productId: cart[i].dataValues.productId,
                      },
                    },
                    {
                      transaction: ormTransaction,
                    }
                  );
                  break;
                }
              }

              // case 2-2:  warehouse pertama memenuhi kebutuhan customer
            } else {
              // console.log("w2 memenuhi kebutuhan");

              // 3. check dlu typenya yg warehouseId == chosenWarehouseId dan bawa item yg user mau
              const checkType = await model.type.findOne({
                where: {
                  colorId: cart[i].dataValues.colorId,
                  memoryId: cart[i].dataValues.memoryId,
                  productId: cart[i].dataValues.productId,
                  warehouseId: chosenWarehouseId,
                },
              });

              if (checkType) {
                //klo ada

                // 1. bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                await model.stockmutation.create(
                  {
                    typeId: findbooked[0].dataValues.id,
                    initialStock: checkType.dataValues.stock,
                    addition: cart[i].dataValues.totalQty,
                    supplierId: allDistance[i][0].id,
                    targetId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                    statusId: 9,
                    onLocation: 0,
                    requestId: 1,
                    creatorId: chosenWarehouseId,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );

                // 2. bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                await model.stockmutation.create(
                  {
                    typeId: findbooked[0].dataValues.id,
                    initialStock: findbooked[0].dataValues.stock,
                    subtraction: cart[i].dataValues.totalQty,
                    supplierId: allDistance[i][0].id,
                    targetId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                    statusId: 9,
                    onLocation: 1,
                    requestId: 2,
                    creatorId: allDistance[i][0].id,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );

                // 3a .update type
                await model.type.update(
                  {
                    stock:
                      checkType.dataValues.stock + cart[i].dataValues.totalQty,
                    booked:
                      checkType.dataValues.booked + cart[i].dataValues.totalQty,
                  },
                  {
                    where: {
                      id: checkType.dataValues.id,
                    },
                  },
                  {
                    transaction: ormTransaction,
                  }
                );

                // 5. bikin order detail
                await model.orderdetail.create(
                  {
                    priceOnDate: findbooked[0].dataValues.discountedPrice,
                    totalQty: cart[i].dataValues.totalQty,
                    totalPrice:
                      findbooked[0].dataValues.discountedPrice *
                      cart[i].dataValues.totalQty,
                    typeId: checkType.dataValues.id,
                    warehouseId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );
              } else {
                // klo tidak ada

                // 1. bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                await model.stockmutation.create(
                  {
                    typeId: findbooked[0].dataValues.id,
                    addition: cart[i].dataValues.totalQty,
                    supplierId: allDistance[i][0].id,
                    targetId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                    statusId: 9,
                    onLocation: 0,
                    requestId: 1,
                    creatorId: chosenWarehouseId,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );

                // 2. bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                await model.stockmutation.create(
                  {
                    typeId: findbooked[0].dataValues.id,
                    initialStock: findbooked[0].dataValues.stock,
                    subtraction: cart[i].dataValues.totalQty,
                    supplierId: allDistance[i][0].id,
                    targetId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                    statusId: 9,
                    onLocation: 1,
                    requestId: 2,
                    creatorId: allDistance[i][0].id,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );

                // 3b. bikin type di di warehouse terdekat
                const createType = await model.type.create(
                  {
                    price: findbooked[0].dataValues.price,
                    discount: findbooked[0].dataValues.discount,
                    discountedPrice: findbooked[0].dataValues.discountedPrice,
                    stock: cart[i].dataValues.totalQty,
                    booked: cart[i].dataValues.totalQty,
                    colorId: cart[i].dataValues.colorId,
                    memoryId: cart[i].dataValues.memoryId,
                    productId: cart[i].dataValues.productId,
                    warehouseId: chosenWarehouseId,
                    statusId: 3,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );

                // 5. bikin order detail
                await model.orderdetail.create(
                  {
                    priceOnDate: findbooked[0].dataValues.discountedPrice,
                    totalQty: cart[i].dataValues.totalQty,
                    totalPrice:
                      findbooked[0].dataValues.discountedPrice *
                      cart[i].dataValues.totalQty,
                    typeId: createType.dataValues.id,
                    warehouseId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                  },
                  {
                    transaction: ormTransaction,
                  }
                );
              }
              // 4. update stock supplier
              await model.type.update(
                {
                  stock:
                    findbooked[0].dataValues.stock -
                    cart[i].dataValues.totalQty,
                },
                {
                  where: {
                    id: findbooked[0].dataValues.id,
                  },
                },
                {
                  transaction: ormTransaction,
                }
              );

              // 6. delete entry di cart buat order tsb.
              await model.cart.destroy(
                {
                  where: {
                    customerId: customerId,
                    colorId: cart[i].dataValues.colorId,
                    memoryId: cart[i].dataValues.memoryId,
                    productId: cart[i].dataValues.productId,
                  },
                },
                {
                  transaction: ormTransaction,
                }
              );
            }
          }
        }
        // console.log("allDistance", allDistance); // array of obj isinya id warehouse dan distance mreka sudah disort yg pling dkat
        await ormTransaction.commit();
        return res.status(200).send({ success: true });
      }
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },

  myOrder: async (req, res, next) => {
    try {
      let page = req.query.page;
      let size = req.query.size;

      const findCustomerId = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });
      const customerId = findCustomerId.dataValues.id;
      if (req.query.status) {
        const getorder = await model.order.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          attributes: { exclude: ["id", "adminId", "customerId"] },
          where: {
            statusId: parseInt(req.query.status) + 8,
            customerId: customerId,
          },
          include: [
            {
              model: model.orderdetail,
              attributes: { exclude: ["id"] },
              include: [
                {
                  model: model.type,
                  attributes: [
                    "discountedPrice",
                    "colorId",
                    "memoryId",
                    "productId",
                  ],
                  include: [
                    { model: model.color, attributes: ["color"] },
                    { model: model.memory, attributes: ["memory"] },
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
                    },
                  ],
                },
              ],
            },
            {
              model: model.status,
              attributes: { exclude: ["id", "createdAt", "updatedAt"] },
            },
          ],
          order: [["createdAt", `${req.query.order}`]],
        });

        return res
          .status(200)
          .send({ data: getorder.rows, datanum: getorder.count });
      } else {
        const getorder = await model.order.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          where: { customerId: customerId },
          attributes: { exclude: ["id", "adminId", "customerId"] },
          include: [
            {
              model: model.orderdetail,
              attributes: { exclude: ["id"] },
              include: [
                {
                  model: model.type,
                  attributes: [
                    "discountedPrice",
                    "colorId",
                    "memoryId",
                    "productId",
                  ],
                  include: [
                    { model: model.color, attributes: ["color"] },
                    { model: model.memory, attributes: ["memory"] },
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
                    },
                  ],
                },
              ],
            },
            {
              model: model.status,
              attributes: { exclude: ["id", "createdAt", "updatedAt"] },
            },
          ],
          order: [["createdAt", `${req.query.order}`]],
        });

        return res
          .status(200)
          .send({ data: getorder.rows, datanum: getorder.count });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  oneOrder: async (req, res, next) => {
    try {
      const findCustomerId = await model.customer.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });
      const customerId = findCustomerId.dataValues.id;

      const getorder = await model.order.findOne({
        attributes: { exclude: ["id", "adminId", "customerId"] },
        where: {
          uuid: req.query.uuid,
          customerId: customerId,
        },
        include: [
          {
            model: model.orderdetail,
            attributes: { exclude: ["id"] },
            include: [
              {
                model: model.type,
                attributes: [
                  "discountedPrice",
                  "colorId",
                  "memoryId",
                  "productId",
                ],
                include: [
                  { model: model.color, attributes: ["color"] },
                  { model: model.memory, attributes: ["memory"] },
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
                  },
                ],
              },
            ],
          },
          {
            model: model.status,
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
        ],
      });

      res.status(200).send({
        data: getorder,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  payment: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      if (req.files) {
        console.log("aaaaaaaaaaaaaaaaaaaaa", req.body.data);

        let { order } = JSON.parse(req.body.data);
        console.log("order = ", order);

        const findOrderId = await model.order.findOne({
          where: {
            uuid: order,
          },
        });
        console.log("bbbbbbbbbbbbbbbb", findOrderId);
        const orderId = findOrderId.dataValues.id;

        await model.order.update(
          {
            paymentProof: `/PaymentProof/${req.files[0]?.filename}`,
            statusId: 10,
          },
          {
            where: {
              id: orderId,
            },
          },
          {
            transaction: ormTransaction,
          }
        );

        await model.stockmutation.update(
          {
            statusId: 10,
          },
          {
            where: {
              orderId: orderId,
            },
          },
          {
            transaction: ormTransaction,
          }
        );

        if (
          fs.existsSync(`./src/public${findOrderId.dataValues.paymentProof}`) &&
          !findOrderId.dataValues.paymentProof.includes("default")
        ) {
          fs.unlinkSync(`./src/public${findOrderId.dataValues.paymentProof}`);
        }
        await ormTransaction.commit();
        res.status(200).send({ success: true });
      } else {
        await ormTransaction.commit();
        res
          .status(400)
          .send({ message: "Please ensure that an image is chosen" });
      }
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },

  getAllCustomerOrder: async (req, res, next) => {
    try {
      let page = req.query.page;
      let size = req.query.size;

      if (req.query.status) {
        let findOrder = await model.order.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          where: {
            statusId: parseInt(req.query.status) + 8,
          },
          include: [
            {
              model: model.customer,
              attributes: ["uuid", "name"],
            },
            {
              model: model.orderdetail,
              attributes: { exclude: ["id"] },
              include: [
                {
                  model: model.type,
                  include: [
                    { model: model.color, attributes: ["color"] },
                    { model: model.memory, attributes: ["memory"] },
                    {
                      model: model.product,
                      attributes: [
                        "uuid",
                        "name",
                        "productImage",
                        "description",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: model.status,
              attributes: ["status"],
            },
          ],
          order: [["createdAt", `${req.query.order}`]],
        });

        return res.status(200).send({
          success: true,
          data: findOrder.rows,
          datanum: findOrder.count,
        });
      } else {
        let findOrder = await model.order.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          include: [
            {
              model: model.customer,
              attributes: ["uuid", "name"],
            },
            {
              model: model.orderdetail,
              attributes: { exclude: ["id"] },
              include: [
                {
                  model: model.type,
                  include: [
                    { model: model.color, attributes: ["color"] },
                    { model: model.memory, attributes: ["memory"] },
                    {
                      model: model.product,
                      attributes: [
                        "uuid",
                        "name",
                        "productImage",
                        "description",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: model.status,
              attributes: ["status"],
            },
          ],
          order: [["createdAt", `${req.query.order}`]],
        });

        return res.status(200).send({
          success: true,
          data: findOrder.rows,
          datanum: findOrder.count,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  customerOrder: async (req, res, next) => {
    try {
      let page = req.query.page;
      let size = req.query.size;

      if (req.query.status) {
        let findOrder = await model.order.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          where: {
            warehouseId: req.query.warehouseId,
            statusId: parseInt(req.query.status) + 8,
          },
          include: [
            {
              model: model.customer,
              attributes: ["uuid", "name"],
            },
            {
              model: model.orderdetail,
              attributes: { exclude: ["id"] },
              include: [
                {
                  model: model.type,
                  include: [
                    { model: model.color, attributes: ["color"] },
                    { model: model.memory, attributes: ["memory"] },
                    {
                      model: model.product,
                      attributes: [
                        "uuid",
                        "name",
                        "productImage",
                        "description",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: model.status,
              attributes: ["status"],
            },
          ],
          order: [["createdAt", `${req.query.order}`]],
        });

        return res.status(200).send({
          success: true,
          data: findOrder.rows,
          datanum: findOrder.count,
        });
      } else {
        let findOrder = await model.order.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          where: {
            warehouseId: req.query.warehouseId,
          },
          include: [
            {
              model: model.customer,
              attributes: ["uuid", "name"],
            },
            {
              model: model.orderdetail,
              attributes: { exclude: ["id"] },
              include: [
                {
                  model: model.type,
                  include: [
                    { model: model.color, attributes: ["color"] },
                    { model: model.memory, attributes: ["memory"] },
                    {
                      model: model.product,
                      attributes: [
                        "uuid",
                        "name",
                        "productImage",
                        "description",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: model.status,
              attributes: ["status"],
            },
          ],
          order: [["createdAt", `${req.query.order}`]],
        });

        return res.status(200).send({
          success: true,
          data: findOrder.rows,
          datanum: findOrder.count,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  customerOrderDetails: async (req, res, next) => {
    try {
      console.log(`req.params`, req.params);
      let getOrderDetails = await model.order.findOne({
        where: {
          uuid: req.params.uuid,
        },
        include: [
          {
            model: model.orderdetail,
            include: [
              {
                model: model.type,
                // attribute: ["price", "discountedPrice"],
                include: [
                  { model: model.color, attributes: ["color"] },
                  { model: model.memory, attributes: ["memory"] },
                  {
                    model: model.product,
                    attributes: ["uuid", "name", "productImage"],
                  },
                ],
              },
            ],
          },
          {
            model: model.status,
            attributes: ["status"],
          },
        ],
      });

      return res.status(200).send({
        success: true,
        data: getOrderDetails,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  paymentConfirmation: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      const findOrderId = await model.order.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });

      const orderId = findOrderId.dataValues.id;

      const findCustomer = await model.customer.findOne({
        where: {
          id: findOrderId.dataValues.customerId,
        },
      });
      const email = findCustomer.dataValues.email;

      const findAdminId = await model.admin.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });

      const adminId = findAdminId.dataValues.id;

      await model.order.update(
        {
          statusId: 11,
          adminId: adminId,
        },
        {
          where: {
            id: orderId,
          },
        },
        {
          transaction: ormTransaction,
        }
      );

      await model.stockmutation.update(
        {
          statusId: 11,
          onLocation: 1,
        },
        {
          where: {
            orderId: orderId,
          },
        },
        {
          transaction: ormTransaction,
        }
      );

      const invoice = `INV/ + ${req.body.uuid.split("-")[0].toUpperCase()}`;

      await transporter.sendMail({
        from: `GadgetHouse.noreply`,
        to: `${email}`,
        subject: "Order Status Update - Payment Confirmed",
        html: `<img src="" />
          <hr />
          <h3>Hello, ${email}</h3>
          <h3>Your order is now being processed.</h3>
          <h3>Your invoice number is ${invoice} .</h3>
          <br>
          <br>
          <p>Regards, Admin GadgetHouse</p>`,
      });

      await ormTransaction.commit();
      res.status(200).send({
        success: true,
        message: "Order Approved",
      });
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },
  paymentRejection: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      const findOrderId = await model.order.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });

      const orderId = findOrderId.dataValues.id;

      const findCustomer = await model.customer.findOne({
        where: {
          id: findOrderId.dataValues.customerId,
        },
      });
      const email = findCustomer.dataValues.email;

      const findAdminId = await model.admin.findOne({
        where: {
          uuid: req.decript.uuid,
        },
      });

      const adminId = findAdminId.dataValues.id;

      await model.order.update(
        {
          statusId: 9,
          adminId: adminId,
        },
        {
          where: {
            id: orderId,
          },
        },
        {
          transaction: ormTransaction,
        }
      );

      await model.stockmutation.update(
        {
          statusId: 9,
        },
        {
          where: {
            orderId: orderId,
          },
        },
        {
          transaction: ormTransaction,
        }
      );

      const orderNo = req.body.uuid.toUpperCase().split("-")[
        req.body.uuid.split("-").length - 1
      ];

      await transporter.sendMail({
        from: `GadgetHouse.noreply`,
        to: `${email}`,
        subject: "Order Status Update - Payment Rejected",
        html: `<img src="" />
          <hr />
          <h3>Hello, ${email}</h3>
          <h3>Your order was rejected, Please re-upload your payment proof.</h3>
          <h3>Order number is ${orderNo}.</h3>
          <br>
          <br>
          <p>Regards, Admin GadgetHouse</p>`,
      });

      await ormTransaction.commit();
      res.status(200).send({
        success: true,
        message: "Order Rejected",
      });
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },
  sendProduct: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      // 1. find orderId
      const findOrderId = await model.order.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });
      const orderId = findOrderId.dataValues.id;

      const findCustomer = await model.customer.findOne({
        where: {
          id: findOrderId.dataValues.customerId,
        },
      });
      const email = findCustomer.dataValues.email;

      // 2. change all stock mutation with the same orderID to be onlocation and status to processing
      await model.stockmutation.update(
        {
          onLocation: 1,
          statusId: 12,
        },
        {
          where: {
            orderId: orderId,
          },
        },
        {
          transaction: ormTransaction,
        }
      );

      // 3. find number of orderdetail to find number of product to send
      const findOrderDetail = await model.orderdetail.findAll({
        where: {
          orderId: orderId,
        },
      });

      for (let i = 0; i < findOrderDetail.length; i++) {
        // 4. find types listed in the orderdetail for needed data
        const findType = await model.type.findOne({
          where: {
            id: findOrderDetail[i].dataValues.typeId,
          },
        });

        // 5. create stock mutation from chosen warehouse to customer
        await model.stockmutation.create(
          {
            typeId: findOrderDetail[i].dataValues.typeId,
            initialStock: findType.dataValues.stock,
            subtraction: findOrderDetail[i].dataValues.totalQty,
            creatorId: findType.dataValues.warehouseId,
            orderId: orderId,
            statusId: 12,
            onLocation: 1,
            requestId: 2,
          },
          {
            transaction: ormTransaction,
          }
        );

        // 6. update type database.
        await model.type.update(
          {
            stock:
              findType.dataValues.stock -
              findOrderDetail[i].dataValues.totalQty,
            booked:
              findType.dataValues.booked -
              findOrderDetail[i].dataValues.totalQty,
          },
          {
            where: {
              id: findOrderDetail[i].dataValues.typeId,
            },
          },
          {
            transaction: ormTransaction,
          }
        );
      }

      // 7. update order status
      await model.order.update(
        {
          statusId: 12,
        },
        {
          where: {
            id: orderId,
          },
        },
        {
          transaction: ormTransaction,
        }
      );

      const orderNo = req.body.uuid.toUpperCase().split("-")[
        req.body.uuid.split("-").length - 1
      ];
      // 8. email customer notify them
      await transporter.sendMail({
        from: `GadgetHouse.noreply`,
        to: `${email}`,
        subject: "Order Status Update - Product is Sent",
        html: `<img src="" />
          <hr />
          <h3>Hello, ${email}</h3>
          <h3>Your order with order number ${orderNo}  is now on the way to you.</h3>
          <br>
          <br>
          <p>Regards, Admin GadgetHouse</p>`,
      });

      await ormTransaction.commit();
      res
        .status(200)
        .send({ message: "product is now on the way to the customer" });
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },
};
