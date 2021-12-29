const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', function(req, res) {

    topRestaurants = [
        {
            imageUrl: 'https://cdn.pixabay.com/photo/2019/07/29/05/52/burger-4369973_960_720.jpg',
            isBanner : false,
            bannerText: '',
            restaurantTitle: 'The American Touch',
            restaurantRating: '4.5',
        }
    ];

    res.render('home', {
        
    });
});

router.get('/components', (req, res) => res.render('components'));

module.exports = router;