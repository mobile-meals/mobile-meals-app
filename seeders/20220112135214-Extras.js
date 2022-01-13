'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dishes = await queryInterface.sequelize.query(
      `SELECT id from Dishes;`
    );

    const dishRows = dishes[0];

    console.log(dishRows);
    
    dishRows.forEach(async function addItems(element, index) {
      await queryInterface.bulkInsert('Extras', [
        {
          name: 'Extra Cheese',
          price: 60,
          dish_id: dishRows[index].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Extra Beef',
          price: 120,
          dish_id: dishRows[index].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Extra Vegies',
          price: 20,
          dish_id: dishRows[index].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    });

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
