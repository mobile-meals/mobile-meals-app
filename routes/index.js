const express = require('express');
const router = express.Router();

const models = require('../models');

const utilHelpers = require('../helpers/utils');
// Welcome Page
router.get('/', async function (req, res) {

    var topRestaurants = await models.Restaurant.findAll({ order: [['rating', 'DESC']] })
        .then(topRestaurantsRecieved => {
            var topRestaurantsArray = [];
            topRestaurantsRecieved = topRestaurantsRecieved.sort((a, b) => b - a).slice(0, 4);

            topRestaurantsRecieved.forEach((item) => {
                topRestaurantsArray.push({
                    restaurantId: item.id,
                    restaurantTitle: item.name,
                    imageUrl: item.image_url,
                    restaurantRating: parseFloat(item.rating).toFixed(1),
                    isBanner: item.is_promotion,
                    bannerText: item.promotion_text,
                    isFavoriteItem: false
                });
            });

            return topRestaurantsArray;
        })
        .catch(err => console.log(err));


    var deals = await models.Restaurant.findAll({ where: { is_promotion: true } })
        .then(dealsRecieved => {
            var dealsArray = [];
            dealsRecieved = dealsRecieved.sort((a, b) => b - a).slice(0, 4);

            
            dealsRecieved.forEach((item) => {
                dealsArray.push({
                    restaurantId: item.id,
                    restaurantTitle: item.name,
                    imageUrl: item.image_url,
                    restaurantRating: parseFloat(item.rating).toFixed(1),
                    isBanner: item.is_promotion,
                    bannerText: item.promotion_text,
                    isFavoriteItem: false
                });
            });

            return dealsArray;
        })
        .catch(err => console.log(err));

    res.render('home', {
        topRestaurants,
        deals
    });
});

router.get('/components', (req, res) => res.render('components'));

router.get('/menu', (req, res) => res.render('Menu', {utilHelpers}));

router.get('/search',async function (req, res) { 
    var recentSeachTerms = [
        'Pepperoni Pizza', 'Mango Juice', 'The American Touch', 'Biriyani', 'Sri Lankan'
    ];

    var dishCategories = await models.DishCategory.findAll()
        .then(dishCategoriesRecieved => {
            var dishCategoriesArray = [];

            dishCategoriesRecieved.forEach((item) => {
                dishCategoriesArray.push({
                    id: item.id,
                    name: item.name,
                    imageUrl: item.image_url
                });
            });

            return dishCategoriesArray;
        })
        .catch(err => console.log(err));

    res.render('Search', {
        recentSeachTerms,
        dishCategories
    })
});

router.get('/cart', function (req, res) {
    var restaurantData = {
        id: 1,
        name:'The American Touch'
    };
    var cartItems = [
        {
            dishId: 1,
            name: 'All American Burger',
            qty: 1,
            price: '1430.00',
            description: 'No Pickles, No Ranch',
            extras: [
                {
                    id: 1,
                    name: 'Extra Cheese',
                    price: '120.00',
                    qty: 2
                },
                {
                    id: 2,
                    name: 'Extra Beef patty',
                    price: '160.00',
                    qty: 1
                }
            ]

        },
        {
            dishId: 4,
            name: 'Texas Tommy',
            qty: 3,
            price: '1650.00',
            description: null,
            extras: []
        }
    ];

    res.render('Cart', {
        restaurantData,
        cartItems
    });
});

module.exports = router;