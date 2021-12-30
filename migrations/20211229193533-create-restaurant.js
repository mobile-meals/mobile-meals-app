'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      image_url: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT
      },
      orders: {
        type: Sequelize.INTEGER
      },
      open_time: {
        type: Sequelize.STRING
      },
      close_time: {
        type: Sequelize.STRING
      },
      is_promotion: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      promotion_text: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Restaurants');
  }
};