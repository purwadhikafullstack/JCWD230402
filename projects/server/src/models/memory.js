'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class memory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  memory.init({
    memory: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'memory',
  });

  memory.associate = (models) => {
    memory.hasMany(models.type, { foreignKey: "memoryId" });
  }

  return memory;
};