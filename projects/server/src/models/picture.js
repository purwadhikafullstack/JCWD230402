"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  picture.init(
    {
      picture: DataTypes.STRING,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "picture",
    }
  );

  picture.associate = (models) => {
    picture.belongsTo(models.product, { foreignKey: "productId" });
  };
  return picture;
};
