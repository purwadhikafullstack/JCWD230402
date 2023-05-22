"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orderdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orderdetail.init(
    {
      priceOnDate: DataTypes.INTEGER,
      totalQty: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      warehouseId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orderdetail",
    }
  );
  orderdetail.associate = (models) => {
    orderdetail.belongsTo(models.order, { foreignKey: "orderId" });
    orderdetail.belongsTo(models.type, { foreignKey: "typeId" });
  };
  return orderdetail;
};
