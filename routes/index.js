const express = require('express');
const router = express.Router();

const models = require('../models');
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

module.exports = router;