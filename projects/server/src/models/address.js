'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  address.init({
    address: DataTypes.STRING,
    location: DataTypes.STRING,
    kabupaten: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    isPrimary: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    customerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};