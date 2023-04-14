const authController = require("./authControllers");
const rajaongkirController = require("./rajaongkirController");
const warehouseController = require("./warehouseController");
const adminController = require("./adminControllers");
const categoryController = require("./categoryControllers");
const productController = require("../controllers/productController")

module.exports = {
    authController,
    rajaongkirController,
    warehouseController,
    adminController,
    categoryController,
    productController
}