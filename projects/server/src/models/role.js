'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  role.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'role',
  });
  role.associate = (models) => {
    role.hasMany(models.admin, { foreignKey: "roleId" })
  }
  return role;
};