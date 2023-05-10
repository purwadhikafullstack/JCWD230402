"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stockMutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  stockMutation.init(
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
      modelName: "stockMutation",
    }
  );
  return stockMutation;
};
