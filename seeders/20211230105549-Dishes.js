'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dishCategories = await queryInterface.sequelize.query(
      `SELECT id from DishCategories;`
    );
    const restaurants = await queryInterface.sequelize.query(
      `SELECT id from Restaurants;`
    );

    const dishCategoryRows = dishCategories[0];
    const restaurantRows = restaurants[0];

    await queryInterface.bulkInsert('Dishes', [
      {
        name: 'Ketchup Mustard Dog',
        image_url: 'https://cdn.pixabay.com/photo/2012/02/29/16/12/hot-19456_960_720.jpg',
        description: 'Boiled Hotdog, served on a fresh bun with ketup and mustard.',
        price: 260.00,
        restaurant_id: restaurantRows[0].id,
        category_id: dishCategoryRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cheesy Dog',
        image_url: 'https://cdn.pixabay.com/photo/2020/06/24/22/45/hot-dog-5337929_960_720.jpg',
        description: 'Boiled Hotdog, served on a fresh bun with ketup and loads of cheese.',
        price: 350.00,
        restaurant_id: restaurantRows[0].id,
        category_id: dishCategoryRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Beef \'n\' Cheese Wraps",
        image_url: 'https://cdn.pixabay.com/photo/2021/01/18/21/12/burrito-5929437_960_720.jpg',
        description: 'Grilled beef wrapped in patty, filled with cheese and ketchup',
        price: 420.00,
        restaurant_id: restaurantRows[0].id,
        category_id: dishCategoryRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Chicken Mini Wraps",
        image_url: 'https://cdn.pixabay.com/photo/2021/01/06/10/11/shawarma-5893935_960_720.jpg',
        description: 'Mini Crispy chicken wraps, filled with vegitables and ketchup',
        price: 400.00,
        restaurant_id: restaurantRows[0].id,
        category_id: dishCategoryRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "All American Burger",
        image_url: 'https://cdn.pixabay.com/photo/2019/01/29/20/00/hamburger-3963181_960_720.jpg',
        description: '2 Beef Paties with Bacon and cheese, with home made special sauce.',
        price: 1150.00,
        restaurant_id: restaurantRows[0].id,
        category_id: dishCategoryRows[3].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Pulled Pork Burger",
        image_url: 'https://cdn.pixabay.com/photo/2021/07/29/18/07/burger-6507710_960_720.jpgg',
        description: 'Pork Burger, served with fries and vegitables',
        price: 1260.00,
        restaurant_id: restaurantRows[0].id,
        category_id: dishCategoryRows[3].id,
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
