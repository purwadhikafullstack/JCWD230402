'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orderDetail.init({
    priceOnDate: DataTypes.INTEGER,
    totalQty: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    warehouseId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'orderDetail',
  });
  return orderDetail;
};