'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Restaurants', [
      {
        name: 'The American Touch',
        image_url: 'https://cdn.pixabay.com/photo/2019/07/29/05/52/burger-4369973_960_720.jpg',
        rating: 5.0,
        orders: 252,
        open_time: '10AM',
        close_time: '10PM',
        is_promotion: false,
        promotion_text: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smoothie Point',
        image_url: 'https://cdn.pixabay.com/photo/2017/01/20/17/25/detox-1995433_960_720.jpg',
        rating: 3.5,
        orders: 125,
        open_time: '10AM',
        close_time: '6PM',
        is_promotion: false,
        promotion_text: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The Big Beef',
        image_url: 'https://cdn.pixabay.com/photo/2016/01/22/02/13/meat-1155132_960_720.jpg',
        rating: 4.9,
        orders: 245,
        open_time: '9AM',
        close_time: '10PM',
        is_promotion: true,
        promotion_text: 'Save on selected items',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deluxor',
        image_url: 'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_960_720.jpg',
        rating: 4.8,
        orders: 148,
        open_time: '9AM',
        close_time: '11PM',
        is_promotion: false,
        promotion_text: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pizza King',
        image_url: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395__480.jpg',
        rating: 3.9,
        orders: 184,
        open_time: '9AM',
        close_time: '11PM',
        is_promotion: true,
        promotion_text: '10% Off',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Python Lounge',
        image_url: 'https://cdn.pixabay.com/photo/2017/09/04/18/39/coffee-2714970_960_720.jpg',
        rating: 4.0,
        orders: 102,
        open_time: '9AM',
        close_time: '8PM',
        is_promotion: false,
        promotion_text: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bread Buddy',
        image_url: 'https://cdn.pixabay.com/photo/2010/12/13/10/14/baguettes-2561_960_720.jpg',
        rating: 4.6,
        orders: 285,
        open_time: '9AM',
        close_time: '6PM',
        is_promotion: true,
        promotion_text: 'Buy 1 Get 1 Free',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Prawn to Addiction',
        image_url: 'https://cdn.pixabay.com/photo/2017/06/04/10/17/prawn-2370680_960_720.jpg',
        rating: 4.7,
        orders: 168,
        open_time: '11AM',
        close_time: '11PM',
        is_promotion: false,
        promotion_text: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Something Fishy',
        image_url: 'https://cdn.pixabay.com/photo/2013/07/19/00/18/seafood-165220_960_720.jpg',
        rating: 4.2,
        orders: 78,
        open_time: '11AM',
        close_time: '12AM',
        is_promotion: true,
        promotion_text: '50% OFF',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sushi Bar',
        image_url: 'https://cdn.pixabay.com/photo/2014/05/26/14/53/sushi-354628_960_720.jpg',
        rating: 3.6,
        orders: 42,
        open_time: '12PM',
        close_time: '12AM',
        is_promotion: false,
        promotion_text: '',
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
