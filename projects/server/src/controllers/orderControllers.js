const sequelize = require("sequelize");
const model = require("../models");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createOrder: async (req, res, next) => {
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

      // console.log("sums", sums);
      // console.log("checkNegative", checkNegative);
      // console.log("warehouseIdArr = ", warehouseIdArr);

      if (checkNegative.includes(true)) {
        // jika total available per type - totalQty per item di cart ada yg negatif

        for (let i = 0; i < sums.length; i++) {
          if (sums[i].result < 0) {
            await model.cart.destroy({
              where: {
                customerId: customerId,
                colorId: sums[i].colorId,
                memoryId: sums[i].memoryId,
                productId: sums[i].productId,
              },
            });
          }
        }

        return res
          .status(400)
          .send({ message: "one or more items are no longer available" });
      } else {
        // jika total available per type - totalQty per item di cart tidak ada yg negatif
        const uuid = uuidv4();

        const order = await model.order.create({
          uuid,
          customerId: customerId,
          deliveryFee: req.body.deliveryFee,
          finalPrice: req.body.finalPrice,
          warehouseId: chosenWarehouseId,
          statusId: 9,
        });

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

          console.log("findbooked[0].dataValues", findbooked[0].dataValues);
          // console.log("findbooked = ", findbooked[0].dataValues);
          // console.log("allDistance = ", allDistance[i][0].id);
          // console.log("getWarehouse = ", chosenWarehouseId);

          // case 1: jika warehouse yg pling dkat dengan customer === warehouse yg membawa variant item tsb
          if (allDistance[i][0].id == chosenWarehouseId) {
            // apakah qtynya cukup ?
            if (
              cart[i].dataValues.totalQty >
              findbooked[0].dataValues.stock - findbooked[0].dataValues.booked
            ) {
              // case 1-1: jika di warehouse pling dkat, availablenya tidak memenuhi qty yg diorder oleh customer
              console.log(
                "warehouse yg pling dkat, availablenya kurang dri qty yg di order oleh customer"
              );

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
                  await model.stockMutation.create({
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
                  });

                  // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                  await model.stockMutation.create({
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
                  });

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
                    }
                  );
                } else if (updatedCart[i].dataValues.totalQty > 0) {
                  //  bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                  await model.stockMutation.create({
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
                  });

                  // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                  await model.stockMutation.create({
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
                  });

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
                    }
                  );

                  // bikin order detail
                  await model.orderDetail.create({
                    priceOnDate: findbooked[0].dataValues.discountedPrice,
                    totalQty: cart[i].dataValues.totalQty,
                    totalPrice:
                      findbooked[0].dataValues.discountedPrice *
                      cart[i].dataValues.totalQty,
                    typeId: findbooked[0].dataValues.id,
                    warehouseId: chosenWarehouseId,
                    orderId: order.dataValues.id,
                  });

                  // delete entry di cart buat order tsb.
                  await model.cart.destroy({
                    where: {
                      customerId: customerId,
                      colorId: cart[i].dataValues.colorId,
                      memoryId: cart[i].dataValues.memoryId,
                      productId: cart[i].dataValues.productId,
                    },
                  });

                  break;
                }
              }
            } else {
              // case 1-2: jika di warehouse pling dkat, availablenya memenuhi qty yg diorder oleh customer
              console.log(
                "warehouse pling dkat, availablenya memenuhi qty yg diorder oleh customer"
              );
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
                }
              );

              // Step 2. bikin order detail untuk tiap product yg di order customer.
              await model.orderDetail.create({
                priceOnDate: findbooked[0].dataValues.discountedPrice,
                totalQty: cart[i].dataValues.totalQty,
                totalPrice:
                  findbooked[0].dataValues.discountedPrice *
                  cart[i].dataValues.totalQty,
                typeId: findbooked[0].dataValues.id,
                warehouseId: chosenWarehouseId,
                orderId: order.dataValues.id,
              });

              // Step 3. delete entry di cart buat order tsb.
              await model.cart.destroy({
                where: {
                  customerId: customerId,
                  colorId: cart[i].dataValues.colorId,
                  memoryId: cart[i].dataValues.memoryId,
                  productId: cart[i].dataValues.productId,
                },
              });
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
              console.log("w2 tidak memenuhi kebutuhan -- loop");

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
                  await model.stockMutation.create({
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
                  });
                  // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                  await model.stockMutation.create({
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
                  });

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
                    await model.stockMutation.create({
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
                    });

                    // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                    await model.stockMutation.create({
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
                    });

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
                      }
                    );

                    // bikin order detail
                    await model.orderDetail.create({
                      priceOnDate: findbooked[0].dataValues.discountedPrice,
                      totalQty: cart[i].dataValues.totalQty,
                      totalPrice:
                        findbooked[0].dataValues.discountedPrice *
                        cart[i].dataValues.totalQty,
                      typeId: checkType.dataValues.id,
                      warehouseId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                    });
                  } else {
                    // klo tidak ada

                    //  bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                    await model.stockMutation.create({
                      typeId: findInfo[0].dataValues.id,

                      addition: updatedCart[i].dataValues.totalQty,
                      supplierId: findInfo[0].dataValues.warehouseId,
                      targetId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                      statusId: 9,
                      onLocation: 0,
                      requestId: 1,
                      creatorId: chosenWarehouseId,
                    });

                    // bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                    await model.stockMutation.create({
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
                    });

                    // bikin type di di warehouse terdekat
                    const createType = await model.type.create({
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
                    });

                    // bikin order detail
                    await model.orderDetail.create({
                      priceOnDate: findbooked[0].dataValues.discountedPrice,
                      totalQty: cart[i].dataValues.totalQty,
                      totalPrice:
                        findbooked[0].dataValues.discountedPrice *
                        cart[i].dataValues.totalQty,
                      typeId: createType.dataValues.id,
                      warehouseId: chosenWarehouseId,
                      orderId: order.dataValues.id,
                    });
                  }

                  // delete entry di cart buat order tsb.
                  await model.cart.destroy({
                    where: {
                      customerId: customerId,
                      colorId: cart[i].dataValues.colorId,
                      memoryId: cart[i].dataValues.memoryId,
                      productId: cart[i].dataValues.productId,
                    },
                  });
                  break;
                }
              }

              // case 2-2:  warehouse pertama memenuhi kebutuhan customer
            } else {
              console.log("w2 memenuhi kebutuhan");

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
                await model.stockMutation.create({
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
                });

                // 2. bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                await model.stockMutation.create({
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
                });

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
                  }
                );
                // 5. bikin order detail
                await model.orderDetail.create({
                  priceOnDate: findbooked[0].dataValues.discountedPrice,
                  totalQty: cart[i].dataValues.totalQty,
                  totalPrice:
                    findbooked[0].dataValues.discountedPrice *
                    cart[i].dataValues.totalQty,
                  typeId: checkType.dataValues.id,
                  warehouseId: chosenWarehouseId,
                  orderId: order.dataValues.id,
                });
              } else {
                // klo tidak ada

                // 1. bikin stock mutation dri warehouse terdekat meminta warehouse yg punya item tsb
                await model.stockMutation.create({
                  typeId: findbooked[0].dataValues.id,
                  addition: cart[i].dataValues.totalQty,
                  supplierId: allDistance[i][0].id,
                  targetId: chosenWarehouseId,
                  orderId: order.dataValues.id,
                  statusId: 9,
                  onLocation: 0,
                  requestId: 1,
                  creatorId: chosenWarehouseId,
                });

                // 2. bikin stock mutation dri warehouse yg bawa item ke warehouse yg pling dkat
                await model.stockMutation.create({
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
                });

                // 3b. bikin type di di warehouse terdekat
                const createType = await model.type.create({
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
                });
                // 5. bikin order detail
                await model.orderDetail.create({
                  priceOnDate: findbooked[0].dataValues.discountedPrice,
                  totalQty: cart[i].dataValues.totalQty,
                  totalPrice:
                    findbooked[0].dataValues.discountedPrice *
                    cart[i].dataValues.totalQty,
                  typeId: createType.dataValues.id,
                  warehouseId: chosenWarehouseId,
                  orderId: order.dataValues.id,
                });
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
                }
              );

              // 6. delete entry di cart buat order tsb.
              await model.cart.destroy({
                where: {
                  customerId: customerId,
                  colorId: cart[i].dataValues.colorId,
                  memoryId: cart[i].dataValues.memoryId,
                  productId: cart[i].dataValues.productId,
                },
              });
            }
          }
        }
        // console.log("allDistance", allDistance); // array of obj isinya id warehouse dan distance mreka sudah disort yg pling dkat
        return res.status(200).send({ success: true });
      }
    } catch (error) {
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
            statusId: parseInt(req.query.status) + 9,
            customerId: customerId,
          },
          include: [
            {
              model: model.orderDetail,
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
              model: model.orderDetail,
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
            model: model.orderDetail,
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
          }
        );

        await model.stockMutation.update(
          {
            statusId: 10,
          },
          {
            where: {
              orderId: orderId,
            },
          }
        );

        res.status(200).send({ success: true });
      } else {
        res
          .status(400)
          .send({ message: "Please ensure that an image is chosen" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
