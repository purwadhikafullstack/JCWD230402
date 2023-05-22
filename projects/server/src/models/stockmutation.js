"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stockmutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  stockmutation.init(
    {
      typeId: DataTypes.INTEGER,
      addition: DataTypes.INTEGER,
      subtraction: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      onLocation: DataTypes.BOOLEAN,
      requestId: DataTypes.INTEGER,
      supplierId: DataTypes.INTEGER,
      targetId: DataTypes.INTEGER,
      creatorId: DataTypes.INTEGER,
      initialStock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "stockmutation",
    }
  );

  stockmutation.associate = (models) => {
    stockmutation.belongsTo(models.type, { foreignKey: "typeId" });
    stockmutation.belongsTo(models.status, { foreignKey: "statusId" });
    stockmutation.belongsTo(models.warehouse, { foreignKey: "supplierId" });
    stockmutation.belongsTo(models.order, { foreignKey: "orderId" });
  };

  return stockmutation;
};
