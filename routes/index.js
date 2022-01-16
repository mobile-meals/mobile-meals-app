const express = require('express');
const router = express.Router();
const axios = require('axios');

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

router.get('/menu', (req, res) => res.render('Menu', { utilHelpers }));

router.get('/search', async function (req, res) {
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

router.get('/cart', async function (req, res) {

    if (typeof req.session.currentUser.restaurantId !== 'undefined') {
        var restaurantData = await models.Restaurant.findOne({ where: { id: req.session.currentUser.restaurantId } })
            .then(resRecieved => {
                return {
                    id: resRecieved.dataValues.id,
                    name: resRecieved.dataValues.name
                };
            })
            .catch(err => console.log(err));
    }


    var cartItems = [];

    var cartItemsInSession = (typeof req.session.currentUser.cartItems == 'undefined') ? [] : req.session.currentUser.cartItems;



    for (const item of cartItemsInSession) {
        var dishData = await models.Dish.findOne({ where: { id: item.dishId } })
            .then(dishRecieved => {
                return dishRecieved.dataValues;
            })
            .catch(err => console.log(err));

        var extraItems = [];

        for (const extra of item.extras) {
            var extraItemData = await models.Extra.findOne({ where: { id: extra } })
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
                cartItemId: item.cartItemId,
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

router.get('/edit-cart-item/:item', async function (req, res) {
    var item = JSON.parse(req.params.item);

    var extrasForDish = await models.Extra.findAll({ where: { dish_id: item.dishId } })
        .then(extraItemsRecieved => {
            var extrasForDishArr = [];

            extraItemsRecieved.forEach(extraItem => {
                extrasForDishArr.push({
                    id: extraItem.dataValues.id,
                    name: extraItem.dataValues.name,
                    price: parseFloat(extraItem.dataValues.price).toFixed(2),
                    isChecked: false
                });
            });

            return extrasForDishArr;
        })
        .catch(err => console.log(err));

    item.extras.forEach(e => {
        if (extrasForDish, e.id) {
            extrasForDish[utilHelpers.getObjectIndexByIdFromArray(extrasForDish, e.id)].isChecked = true;
        }
    });


    var item = {
        cartItemId: item.cartItemId,
        dishId: item.dishId,
        name: item.name,
        qty: item.qty,
        price: item.price,
        description: item.description,
        extras: extrasForDish
    };

    console.log(item);

    res.render('partials/dialogs/EditCartItem', {
        item
    });
});

router.get('/my-addresses',async function(req, res){
    currentUserId = req.session.currentUser.id;

    var existingAddressesforUser = await models.Address.findAll({
        where: { user_id: currentUserId }
    }).then(existingAddresses => {
        var addresses = [];
        console.log("Recieved: ",existingAddresses);

        if (existingAddresses instanceof Array){
            existingAddresses.forEach(address =>{
                console.log("Array");
                console.log("add: ", address);
                var formattedAddress = utilHelpers.formatAddress(address.dataValues);

                var addressObj = {
                    isDefault: address.dataValues.is_default,
                    tag: address.dataValues.tag,
                    address: formattedAddress,
                    coords: [address.dataValues.longitude, address.dataValues.latitude]
                }

                addresses.push(addressObj);
            });
        }else{
            console.log("OBJECT");
            var formattedAddress = utilHelpers.formatAddress(existingAddresses.dataValues);

            var addressObj = {
                isDefault: existingAddresses.dataValues.is_default,
                tag: existingAddresses.dataValues.tag,
                address: formattedAddress,
                coords: [existingAddresses.dataValues.longitude, existingAddresses.dataValues.latitude]
            }

            addresses.push(addressObj);
        }

        return addresses;
    })
    .catch(err => console.log(err));

    existingAddressesforUser.sort(function(x, y) { return x - y });

    existingAddressesforUser.reverse();

    res.render('Address', {
        existingAddressesforUser
    });
});

router.get('/locate', (req, res) => {
    res.render('LocateMe');
});

router.post('/locate', (req, res) => {
    const { longitude, latitude } = req.body;

    req.session.currentUser.location = [
        longitude, latitude
    ];

    res.redirect('/add-address');
});

router.get('/add-address', async function (req, res) {

    const lnglat = typeof req.session.currentUser.location !== 'undefined' ? req.session.currentUser.location : [];

    let prefilledData = {};

    if (lnglat.length > 0) {

        const url = `https://eu1.locationiq.com/v1/reverse.php?key=pk.9e3258d85f622591c06d831ff0f2724c&lat=${lnglat[1]}&lon=${lnglat[0]}&format=json`;

        try{
            const response = await axios.get(url);
            prefilledData = response.data instanceof Array ? response.data[0].address : response.data.address;
        }catch(err){
            console.error(err);
        }
    }

    currentUserId = req.session.currentUser.id;

    const countOfAddressesforUser = await models.Address.count({ where: { user_id: currentUserId }});

    var isDisabled = countOfAddressesforUser === 0 ? true:false;
    
    var isDefault = isDisabled ? true:false;

    res.render('AddAddress', {
        prefilledData,
        isDisabled,
        isDefault
    });
});


router.post('/add-address', async function (req, res) {

    const lnglat = typeof req.session.currentUser.location !== 'undefined' ? req.session.currentUser.location : [];

    const { name, phone, address_1, address_2, suburb, city, zipcode, tag, is_default} = req.body;

    var currentUserId = req.session.currentUser.id;

    //Check if user has previous addresses.
    const countOfAddressesforUser = await models.Address.count({ where: { user_id: currentUserId }});

    var def = is_default === 'on' ? true: false;

    let isDefault = countOfAddressesforUser === 0 ? true: def;

    if (isDefault && countOfAddressesforUser !== 0){
        // Get All Ids for previous addresses
        var existingAddressIds = await models.Address.findAll({
            where: { user_id: currentUserId },
            attributes: ['id']
        }).then(existingAddresses => {
            var ids = [];
    
            if (existingAddresses instanceof Array){
                existingAddresses.forEach(address =>{
                    ids.push(address.dataValues.id);
                });
            }else{
                ids.push(existingAddresses.dataValues.id);
            }
    
            return ids;
        })
        .catch(err => console.log(err));

        const update = await models.Address.update({ is_default: false },{where: {id: existingAddressIds}});
    }

    var newAddress = {
        longitude: lnglat[0],
        latitude: lnglat[1],
        user_id: currentUserId,
        name: name,
        phone: phone,
        address_1: address_1,
        address_2: address_2,
        suburb: suburb,
        city: city,
        post_code: zipcode,
        is_default: isDefault,
        tag: tag,
        createdAt: new Date(),
        updateddAt: new Date()
    }

    const addressCreated = await models.Address.create(newAddress);

    res.redirect('/my-addresses');
});


router.get('/my-cards',async function(req, res){
    var currentUserId = req.session.currentUser.id;

    var existingCardsforUser = await models.Card.findAll({
        where: { user_id: currentUserId }
    }).then(existingCards => {
        var cards = [];

        if (existingCards instanceof Array){
            existingCards.forEach(card =>{

                var cardNumberFormatted = utilHelpers.getLast4DigitsOfCard(card.dataValues.card_number);

                var cardObject = {
                    cardNumberFormatted: cardNumberFormatted,
                    exp: card.dataValues.exp_date,
                    type: card.dataValues.type,
                    isDefault: card.dataValues.is_default
                }

                cards.push(cardObject);
            });
        }else{
            var cardNumberFormatted = utilHelpers.getLast4DigitsOfCard(existingCards.dataValues.card_number);

            var cardObject = {
                cardNumberFormatted: cardNumberFormatted,
                exp: existingCards.dataValues.exp_date,
                type: existingCards.dataValues.type,
                isDefault: existingCards.dataValues.is_default
            }

            cards.push(cardObject);
        }

        return cards;
    })
    .catch(err => console.log(err));

    existingCardsforUser.sort(function(x, y) { return x - y });

    existingCardsforUser.reverse();

    res.render('CreditCards', {
        existingCardsforUser
    });
});

router.get('/add-card',async function(req, res){
    currentUserId = req.session.currentUser.id;

    const countOfCardsforUser = await models.Card.count({ where: { user_id: currentUserId }});

    var isDisabled = countOfCardsforUser === 0 ? true:false;
    
    var isDefault = isDisabled ? true:false;

    res.render('AddCard', {
        isDisabled,
        isDefault
    });
});

router.post('/add-card',async function(req, res){
    const cardTypes = [
        'VISA', 'MASTER CARD', 'AMEX'
    ];

    const { name, card_no, exp, cvc, is_default} = req.body;

    var currentUserId = req.session.currentUser.id;

    const countOfCardsForUser = await models.Card.count({ where: { user_id: currentUserId }});

    var def = is_default === 'on' ? true: false;

    let isDefault = countOfCardsForUser === 0 ? true: def;

    if (isDefault && countOfCardsForUser !== 0){
        // Get All Ids for previous cards
        var existingCardIds = await models.Card.findAll({
            where: { user_id: currentUserId },
            attributes: ['id']
        }).then(existingCards => {
            var ids = [];
    
            if (existingCards instanceof Array){
                existingCards.forEach(card =>{
                    ids.push(card.dataValues.id);
                });
            }else{
                ids.push(existingCards.dataValues.id);
            }
    
            return ids;
        })
        .catch(err => console.log(err));

        const update = await models.Card.update({ is_default: false },{where: {id: existingCardIds}});
    }

    const random = Math.floor(Math.random() * cardTypes.length);

    var cardType = cardTypes[random];

    var newCard = {
        user_id: currentUserId,
        cardholder_name: name,
        card_number: card_no,
        exp_date: exp,
        cvc:cvc,
        type:cardType,
        is_default: isDefault,
        createdAt: new Date(),
        updateddAt: new Date()
    }

    const cardCreated = await models.Card.create(newCard);

    res.redirect('/my-cards');
});

module.exports = router;