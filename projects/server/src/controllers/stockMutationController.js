const model = require("../models");
const sequelize = require("sequelize")

module.exports = {
    getProduct: async (req, res, next) => {
        try {
            let getProduct = await model.product.findAll({
                attributes: ["id", "uuid", "name"],
                where: {
                    isDisabled: 0
                }
            })

            res.status(200).send({
                success: true,
                data: getProduct
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    getWarehouse: async (req, res, next) => {
        try {
            console.log(`req.body`, req.body);

            let getWarehouse = await model.type.findAll({
                attributes: ["id", "warehouseId"],
                where: {
                    productId: req.body.productId,
                    colorId: req.body.colorId,
                    memoryId: req.body.memoryId
                },
                include: [
                    { model: model.warehouse, attributes: ["name"] }
                ]
            })

            // console.log(`res`, getWarehouse);

            res.status(200).send({
                status: true,
                data: getWarehouse
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    requestStock: async (req, res, next) => {
        console.log(`req.body`, req.body);
        try {
            let { productId, colorId, memoryId, warehouseRequest, warehouseSend, stock } = req.body

            let cekType = await model.type.findOne({
                where: {
                    productId: productId,
                    colorId: colorId,
                    memoryId: memoryId,
                    warehouseId: warehouseRequest
                }
            })

            console.log(`cektype`, cekType);

            if (cekType) {
                let requestStock = await model.stockMutation.create({
                    typeId: cekType.dataValues.id,
                    addition: stock,
                    subStraction: 0,
                    statusId: 6,
                    requestId: 1,
                    onLocation: 0,
                    supplierId: warehouseSend,
                    targetId: warehouseRequest,
                    creatorId: warehouseRequest, // WAREHOUSE ID YANG MEMINTA
                    initialStock: cekType.dataValues.stock
                })

                return res.status(200).send({
                    success: true,
                    message: "request berhasil di buat, menunggu konfirmasi",
                    data: requestStock
                })

            } else {
                let cekType = await model.type.findOne({
                    where: {
                        productId: productId,
                        colorId: colorId,
                        memoryId: memoryId,
                        warehouseId: warehouseSend
                    }
                })

                console.log(`cekType`, cekType);

                let addVariant = await model.type.create({
                    price: cekType.dataValues.price,
                    discount: cekType.dataValues.discount,
                    discountedPrice: cekType.dataValues.discountedPrice,
                    stock: 0,
                    colorId: colorId,
                    memoryId: memoryId,
                    productId: productId,
                    statusId: 3,
                    warehouseId: warehouseRequest,
                    booked: 0
                })
                console.log(`addVariant`, addVariant);

                let stockMutation = await model.stockMutation.create({
                    typeId: addVariant.dataValues.id,
                    addition: stock,
                    subStraction: 0,
                    statusId: 6,
                    onLocation: 0,
                    requestId: 1,
                    supplierId: warehouseSend,
                    targetId: warehouseRequest,
                    creatorId: warehouseRequest,
                    initialStock: addVariant.dataValues.stock
                })

                console.log(`stockMutation`, stockMutation);

                return res.status(200).send({
                    success: true,
                    message: `variasi berhasil ditambah, request berhasil di buat, menunggu konfirmasi`,
                    data: stockMutation
                })
            }


        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    getRequest: async (req, res, next) => {
        try {
            if (req.query.warehouseId) {
                console.log(`ini req.query`, req.query);
                let getRequest = await model.stockMutation.findAll({
                    where: {
                        requestId: 1,
                        supplierId: req.query.warehouseId,
                        statusId: 6
                    },
                    include: [
                        {
                            model: model.type,
                            include: [
                                { model: model.warehouse, attributes: ["name"] },
                                { model: model.product, attributes: ["name"] },
                                { model: model.color, attributes: ["color"] },
                                { model: model.memory, attributes: ["memory"] }
                            ]
                        },
                        {
                            model: model.status, attributes: ["status"]
                        }
                    ]
                })

                // console.log(`getRequest`, getRequest);

                return res.status(200).send({
                    success: true,
                    data: getRequest
                })

            } else {
                let getRequest = await model.stockMutation.findAll({
                    where: {
                        requestId: 1,
                        statusId: 6
                    },
                    include: [
                        {
                            model: model.type,
                            include: [
                                { model: model.warehouse, attributes: ["name"] },
                                { model: model.product, attributes: ["name"] },
                                { model: model.color, attributes: ["color"] },
                                { model: model.memory, attributes: ["memory"] }
                            ]
                        },
                        {
                            model: model.status, attributes: ["status"]
                        },
                        {
                            model: model.warehouse, attributes: ["name"]
                        }
                    ],
                    order: [
                        ["id", "DESC"]
                    ]
                })

                console.log(`getRequest`, getRequest);

                return res.status(200).send({
                    success: true,
                    data: getRequest
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    getSend: async (req, res, next) => {
        try {
            if (req.query.warehouseId) {
                console.log(`ini req.query`, req.query);
                let getSend = await model.stockMutation.findAll({
                    where: {
                        requestId: 1,
                        creatorId: req.query.warehouseId,
                        statusId: {
                            [sequelize.Op.or]: [6, 8]
                        }
                    },
                    include: [
                        { model: model.warehouse, attributes: ["name"] },
                        {
                            model: model.type,
                            include: [
                                { model: model.product, attributes: ["name"] },
                                { model: model.color, attributes: ["color"] },
                                { model: model.memory, attributes: ["memory"] }
                            ]
                        },
                        {
                            model: model.status, attributes: ["status"]
                        }
                    ],
                    order: [
                        ["id", "DESC"]
                    ]
                })

                // console.log(`getSend`, getSend);

                return res.status(200).send({
                    success: true,
                    data: getSend
                })
            } else {
                console.log(`ini req.query`, req.query);
                let getSend = await model.stockMutation.findAll({
                    where: {
                        requestId: 1,
                        statusId: {
                            [sequelize.Op.or]: [6, 8]
                        }
                    },
                    include: [
                        { model: model.warehouse, attributes: ["name"] },
                        {
                            model: model.type,
                            include: [
                                { model: model.product, attributes: ["name"] },
                                { model: model.warehouse, attributes: ["name"] },
                                { model: model.color, attributes: ["color"] },
                                { model: model.memory, attributes: ["memory"] }
                            ]
                        },
                        {
                            model: model.status, attributes: ["status"]
                        }
                    ],
                    order: [
                        ["id", "DESC"]
                    ]
                })

                // console.log(`getSend`, getSend);

                return res.status(200).send({
                    success: true,
                    data: getSend
                })
            }


        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    acceptRequest: async (req, res, next) => {
        try {
            console.log(`req.body`, req.body);

            // cek type di warehouse yang di minta
            let findType = await model.type.findOne({
                where: {
                    productId: req.body.productId,
                    colorId: req.body.colorId,
                    memoryId: req.body.memoryId,
                    warehouseId: req.body.warehouseId,
                }
            })

            console.log(`findType`, findType);


            // case ketika sudah ketemu type nya, cek stock nya mencukupi atau tidak
            if (findType.dataValues.stock - req.body.request <= 0) {
                return res.status(500).send({
                    success: false,
                    message: "stok tidak cukup"
                })
            } else {
                //jika cukup, maka stockmutation yang request menjadi complete
                let accept = await model.stockMutation.update({
                    statusId: 7
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                console.log(`accept`, accept);

                // update stock di warehouse yang diminta (stock warehouse yang diminta - stok yang diminta)
                let updateStock = await model.type.update({
                    stock: findType.dataValues.stock - req.body.request
                }, {
                    where: {
                        id: findType.dataValues.id
                    },
                })

                console.log(`updateStock`, updateStock);

                // bikin stock mutation untuk warehouse yang diminta
                let changeStock = await model.stockMutation.create({
                    typeId: findType.dataValues.id,
                    addition: 0,
                    subtraction: req.body.request,
                    statusId: 7,
                    requestId: 2,
                    onLocation: 1,
                    supplierId: req.body.warehouseId,
                    targetId: req.body.warehouseRequest,
                    creatorId: req.body.warehouseId,
                    initialStock: findType.dataValues.stock
                })

                console.log(`changeStock`, changeStock);

                // get type stock di warehouse yang request
                let getTypeWarehouseRequest = await model.type.findOne({
                    where: {
                        productId: req.body.productId,
                        colorId: req.body.colorId,
                        memoryId: req.body.memoryId,
                        warehouseId: req.body.warehouseRequest,
                    }
                })
                console.log(`getTypeWarehouseRequest: `, getTypeWarehouseRequest);

                // update stock di warehouse yang request
                let updateStockRequest = await model.type.update({
                    stock: getTypeWarehouseRequest.dataValues.stock + req.body.request
                }, {
                    where: {
                        id: getTypeWarehouseRequest.dataValues.id
                    }
                })

                console.log(`updateStockRequest`, updateStockRequest);

                return res.status(200).send({
                    success: true,
                    message: "permintaan stok diterima"
                })
            }



        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    rejectRequest: async (req, res, next) => {
        try {
            console.log(`req.params`, req.params);

            let rejectRequest = await model.stockMutation.update({
                statusId: 8
            }, {
                where: {
                    id: req.params.id
                }
            })

            console.log(`rejectRequest`, rejectRequest);

            return res.status(200).send({
                success: true,
                message: "permintaan stock di tolak"
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}