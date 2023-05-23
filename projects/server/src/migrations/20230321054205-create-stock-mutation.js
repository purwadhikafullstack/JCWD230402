'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stockMutations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productAtWarehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      addition: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subtraction: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      onLocation: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      requestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      supplierId: {
        type: Sequelize.INTEGER
      },
      targetId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stockMutations');
  }
};