"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  type.init(
    {
      price: DataTypes.INTEGER,
      discount: DataTypes.FLOAT,
      discountedPrice: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      colorId: DataTypes.STRING,
      memoryId: DataTypes.STRING,
      productId: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "type",
    }
  );

  type.associate = (models) => {
    type.belongsTo(models.product, { foreignKey: "productId" });
    type.belongsTo(models.memory, { foreignKey: "memoryId" });
    type.belongsTo(models.color, { foreignKey: "colorId" });
    type.hasMany(models.productAtWarehouse, { foreignKey: "typeId" });
  };
  return type;
};
