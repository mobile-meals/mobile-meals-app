'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DishCategories', [
      {
        name: 'Hot Dogs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wraps',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Submarines',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Burgers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Juices',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deserts',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rice & Curry',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fried Rice',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Beef',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chicken',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pork',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mutton',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fish',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pasta',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Coffee',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bakery',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Prawns',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cuttlefish',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
