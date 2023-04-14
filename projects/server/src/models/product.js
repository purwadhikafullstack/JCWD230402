"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init(
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      productImage: DataTypes.STRING,
      description: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      isDisabled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "product",
    }
  );

  product.associate = (models) => {
    product.belongsTo(models.category, { foreignKey: "categoryId" });
    product.hasMany(models.picture, { foreignKey: "productId" });
    product.hasMany(models.type, { foreignKey: "productId" });
  };
  return product;
};
