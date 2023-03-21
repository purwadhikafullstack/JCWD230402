'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    uuid: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    deliveryFee: DataTypes.INTEGER,
    paymentProof: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER,
    isCancelled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};