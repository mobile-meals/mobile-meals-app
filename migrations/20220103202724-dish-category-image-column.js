'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'DishCategories',
      'image_url',
      {
        type: Sequelize.STRING,
        after: "name"
      }
    );
  }
};