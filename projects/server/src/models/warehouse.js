"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  warehouse.init(
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      location: DataTypes.STRING,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      phone: DataTypes.STRING,
      province_id: DataTypes.INTEGER,
      city_id: DataTypes.INTEGER,
      isDisabled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "warehouse",
    }
  );

  warehouse.associate = (models) => {
    warehouse.hasMany(models.admin, { foreignKey: "warehouseId" });
    warehouse.hasMany(models.type, { foreignKey: "warehouseId" });
    warehouse.hasMany(models.stockMutation, { foreignKey: "supplierId" });
  };
  
  return warehouse;
};
