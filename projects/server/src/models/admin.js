"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin.init(
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profileImage: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
      roleId: DataTypes.INTEGER,
      warehouseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "admin",
    }
  );

  admin.associate = (models) => {
    admin.belongsTo(models.role, { foreignKey: "roleId" });
    admin.belongsTo(models.warehouse, { foreignKey: "warehouseId" });
  };
  return admin;
};
