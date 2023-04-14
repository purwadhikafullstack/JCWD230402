"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productAtWarehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  productAtWarehouse.init(
    {
      stock: DataTypes.INTEGER,
      booked: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      warehouseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "productAtWarehouse",
    }
  );
  productAtWarehouse.associate = (models) => {
    productAtWarehouse.belongsTo(models.type, { foreignKey: "typeId" });
  };
  return productAtWarehouse;
};
