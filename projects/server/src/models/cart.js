"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cart.init(
    {
      totalQty: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      colorId: DataTypes.INTEGER,
      memoryId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "cart",
    }
  );

  cart.associate = (models) => {
    cart.belongsTo(models.product, { foreignKey: "productId" });
    cart.belongsTo(models.color, { foreignKey: "colorId" });
    cart.belongsTo(models.memory, { foreignKey: "memoryId" });
  };
  return cart;
};
