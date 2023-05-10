"use strict";
const { Model } = require("sequelize");
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
  orderDetail.init(
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
      modelName: "orderDetail",
    }
  );
  orderDetail.associate = (models) => {
    orderDetail.belongsTo(models.order, { foreignKey: "orderId" });
    orderDetail.belongsTo(models.type, { foreignKey: "typeId" });
  };
  return orderDetail;
};
