const express = require('express');
const router = express.Router();

const models = require('../models');

const utilHelpers = require('../helpers/utils');
const dish = require('../models/dish');
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
    console.log(req.session);
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

router.get('/cart',async function (req, res) {
    var restaurantData = {
        id: 1,
        name:'The American Touch'
    };

    var cartItems = [];

    var cartItemsInSession = (typeof req.session.currentUser.cartItems == 'undefined') ? [] : req.session.currentUser.cartItems;

    for (const item of cartItemsInSession){
        var dishData = await models.Dish.findOne({ where: { id: item.dishId }})
        .then(dishRecieved => {
            return dishRecieved.dataValues;
        })
        .catch(err => console.log(err));

        var extraItems = [];

        for(const extra of item.extras){
            var extraItemData = await models.Extra.findOne({ where: { id: extra }})
                .then(extraItemRecieved => {
                    return extraItemRecieved.dataValues;
                })
                .catch(err => console.log(err));

            extraItems.push({
                id: extraItemData.id,
                name: extraItemData.name,
                price: parseFloat(extraItemData.price).toFixed(2)
            });

        }

        var priceForExtras = 0;

        extraItems.forEach(item => {
            priceForExtras += parseFloat(item.price);
        });


        cartItems.push(
            {
                dishId: dishData.id,
                name: dishData.name,
                qty: item.qty,
                price: parseFloat((dishData.price * item.qty) + priceForExtras).toFixed(2),
                description: item.notes,
                extras: extraItems
            }
        );
    }

    res.render('Cart', {
        restaurantData,
        cartItems,
        utilHelpers
    });
});

module.exports = router;