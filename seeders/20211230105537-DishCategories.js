'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DishCategories', [
      {
        name: 'Hot Dogs',
        image_url: 'https://cdn.pixabay.com/photo/2020/06/24/22/45/hot-dog-5337929_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wraps',
        image_url: 'https://cdn.pixabay.com/photo/2020/08/04/17/45/food-5463461_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Submarines',
        image_url: 'https://cdn.pixabay.com/photo/2016/08/09/11/27/sandwich-1580353_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Burgers',
        image_url: 'https://cdn.pixabay.com/photo/2020/03/21/11/17/burger-4953465_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Juices',
        image_url: 'https://cdn.pixabay.com/photo/2017/08/03/21/48/drinks-2578446_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deserts',
        image_url: 'https://cdn.pixabay.com/photo/2021/10/04/20/02/donuts-6680927_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rice & Curry',
        image_url: 'https://cdn.pixabay.com/photo/2021/06/08/01/31/rice-6319366_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fried Rice',
        image_url: 'https://cdn.pixabay.com/photo/2021/05/31/01/10/fried-rice-6297407_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Beef',
        image_url: 'https://cdn.pixabay.com/photo/2018/09/14/11/12/food-3676796_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chicken',
        image_url: 'https://cdn.pixabay.com/photo/2016/02/14/10/39/chicken-1199243_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pork',
        image_url: 'https://cdn.pixabay.com/photo/2019/05/26/20/10/meat-4231141_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mutton',
        image_url: 'https://cdn.pixabay.com/photo/2016/03/05/20/06/abstract-1238656_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fish',
        image_url: 'https://cdn.pixabay.com/photo/2017/12/04/15/49/salmon-2997240_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pasta',
        image_url: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Coffee',
        image_url: 'https://cdn.pixabay.com/photo/2017/09/04/18/39/coffee-2714970_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bakery',
        image_url: 'https://cdn.pixabay.com/photo/2016/03/27/21/59/bread-1284438_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Prawns',
        image_url: 'https://cdn.pixabay.com/photo/2016/03/05/20/07/grilled-1238668_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cuttlefish',
        image_url: 'https://cdn.pixabay.com/photo/2018/09/16/20/03/squid-3682283_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pizza',
        image_url: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biriyani',
        image_url: 'https://cdn.pixabay.com/photo/2021/02/25/07/47/mandi-6048376_960_720.jpg',
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
