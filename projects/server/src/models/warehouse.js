'use strict';
const {
  Model
} = require('sequelize');
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
  warehouse.init({
    uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    location: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    phone: DataTypes.STRING,
    province_id: DataTypes.STRING,
    city_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'warehouse',
  });
  return warehouse;
};