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

router.get('/menu', async function (req, res) {
    const currentUserId = req.session.currentUser.id;

    const tiers = {
        "GREEN": 'http://localhost:5000/img/Green.svg',
        "BRONZE": 'http://localhost:5000/img/Bronze.svg',
        "SILVER": 'http://localhost:5000/img/Silver.svg',
        "GOLD": 'http://localhost:5000/img/Gold.svg',
    }

    var rewardItemForUser = await models.Reward.findOne({ where: { user_id: currentUserId } })
        .then(rewardItem => {
            return rewardItem.dataValues;
        })
        .catch(err => console.log(err));

    var userRewardItem = null;


    if (typeof rewardItemForUser !== 'undefined') {
        userRewardItem = rewardItemForUser;
    } else {
        var tier = utilHelpers.getUserLoyaltyTier(0);

        var rewardsEntry = {
            user_id: currentUserId,
            points: 0.00,
            tier: tier,
            createdAt: new Date(),
            updateddAt: new Date()
        }

        const rewardItemCreated = await models.Reward.create(rewardsEntry);

        userRewardItem = rewardItemCreated.dataValues;
    }

    var currentTierImageURL = tiers[userRewardItem.tier];

    var nextTierImageURL = tiers[utilHelpers.getNextTier(userRewardItem.tier)];

    const currentTierMinPoints = utilHelpers.getCurrentTierMinPoints(userRewardItem.tier);
    const nextTierMinPoints = utilHelpers.getNextTierMinPoints(userRewardItem.tier);

    var percentageOfPoints = parseInt(( (parseInt(userRewardItem.points)- currentTierMinPoints)/ (nextTierMinPoints - currentTierMinPoints) ) * 100);

    console.log(userRewardItem.tier);
    console.log(nextTierMinPoints);


    res.render('Menu', { 
        utilHelpers,
        userRewardItem,
        currentTierImageURL,
        nextTierImageURL,
        nextTierMinPoints,
        percentageOfPoints
     })
});

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

    const currentUserId = req.session.currentUser.id;

    var defaultFormattedAddress = await models.Address.findOne({ where: { user_id: currentUserId, is_default: true } })
        .then(addressReceived => {
            req.session.currentUser.defaultAddressId = addressReceived.dataValues.id;

            return {
                id: addressReceived.dataValues.id,
                address: utilHelpers.formatAddress(addressReceived.dataValues)
            };
        })
        .catch(err => console.log(err));

    var defaultCard = await models.Card.findOne({ where: { user_id: currentUserId, is_default: true } })
        .then(cardReceived => {
            req.session.currentUser.defaultCardId = cardReceived.dataValues.id;

            return {
                id: cardReceived.dataValues.id,
                lastDigits: utilHelpers.getLast4DigitsOfCard(cardReceived.dataValues.card_number)
            };
        })
        .catch(err => console.log(err));

    console.log(defaultFormattedAddress);


    res.render('Cart', {
        restaurantData,
        cartItems,
        utilHelpers,
        defaultFormattedAddress,
        defaultCard
    });
});

router.post('/cart', async function (req, res) {
    const currentUserId = req.session.currentUser.id;
    const defaultAddressId = req.session.currentUser.defaultAddressId;
    const defaultCardId = req.session.currentUser.defaultCardId;
    const orderStatus = 'PREPARING';
    const restaurantId = req.session.currentUser.restaurantId;

    const { notes, subTotal, discount, deliveryCharge, total } = req.body;

    const cartItemsInSession = req.session.currentUser.cartItems;

    // Creating the Order Entry in DB
    var newOrderEntry = {
        notes: notes,
        status: orderStatus,
        address_id: parseInt(defaultAddressId),
        payment_type_id: parseInt(defaultCardId),
        sub_total: parseFloat(subTotal),
        discount: parseFloat(discount),
        delivery_charge: parseFloat(deliveryCharge),
        total: parseFloat(total),
        restaurant_id: parseInt(restaurantId),
        order_date_time: new Date(),
        user_id: currentUserId,
        createdAt: new Date(),
        updateddAt: new Date()
    }

    const orderCreated = await models.Order.create(newOrderEntry);

    const orderId = orderCreated.dataValues.id;

    //Create Entries for Cart Items
    for (const cartItem of cartItemsInSession) {
        var cartItemEntry = {
            dish_id: cartItem.dishId,
            qty: cartItem.qty,
            price: parseFloat(cartItem.price),
            note: cartItem.notes,
            order_id: orderId,
            createdAt: new Date(),
            updateddAt: new Date()
        }

        const cartItemCreated = await models.CartItem.create(cartItemEntry);

        const cartItemCreatedId = cartItemCreated.dataValues.id;

        for (cartItemExtraId of cartItem.extras) {
            var extraItemData = await models.Extra.findOne({ where: { id: cartItemExtraId } })
                .then(extraItemRecieved => {
                    return extraItemRecieved.dataValues;
                })
                .catch(err => console.log(err));

            var cartExtraItemEntry = {
                cart_item_id: cartItemCreatedId,
                extra_id: extraItemData.id,
                qty: 1,
                price: parseFloat(1 * extraItemData.price),
                createdAt: new Date(),
                updateddAt: new Date()
            }

            const cartItemExtraCreated = await models.CartItemExtra.create(cartExtraItemEntry);
        }
    }

    var rewardsPointsEarned = parseFloat(newOrderEntry.total / 100);



    var rewardItemForUser = await models.Reward.findOne({ where: { user_id: currentUserId } })
        .then(rewardItem => {
            return rewardItem.dataValues;
        })
        .catch(err => console.log(err));

    console.log(rewardItemForUser);

    if (typeof rewardItemForUser !== 'undefined') {
        var points = parseFloat(rewardItemForUser.points + rewardsPointsEarned);

        var tier = utilHelpers.getUserLoyaltyTier(points);

        const update = await models.Reward.update({ points: points, tier: tier }, { where: { user_id: currentUserId } });
    } else {
        var tier = utilHelpers.getUserLoyaltyTier(rewardsPointsEarned);
        var rewardsEntry = {
            user_id: currentUserId,
            points: rewardsPointsEarned,
            tier: tier,
            createdAt: new Date(),
            updateddAt: new Date()
        }

        const rewardItemCreated = await models.Reward.create(rewardsEntry);
    }

    req.session.currentUser.cartItems = [];

    res.redirect('/review');
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

    res.render('partials/dialogs/EditCartItem', {
        item
    });
});

router.get('/my-addresses', async function (req, res) {
    currentUserId = req.session.currentUser.id;

    var existingAddressesforUser = await models.Address.findAll({
        where: { user_id: currentUserId }
    }).then(existingAddresses => {
        var addresses = [];
        console.log("Recieved: ", existingAddresses);

        if (existingAddresses instanceof Array) {
            existingAddresses.forEach(address => {
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
        } else {
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

    existingAddressesforUser.sort(function (x, y) { return x - y });

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

        try {
            const response = await axios.get(url);
            prefilledData = response.data instanceof Array ? response.data[0].address : response.data.address;
        } catch (err) {
            console.error(err);
        }
    }

    currentUserId = req.session.currentUser.id;

    const countOfAddressesforUser = await models.Address.count({ where: { user_id: currentUserId } });

    var isDisabled = countOfAddressesforUser === 0 ? true : false;

    var isDefault = isDisabled ? true : false;

    res.render('AddAddress', {
        prefilledData,
        isDisabled,
        isDefault
    });
});


router.post('/add-address', async function (req, res) {

    const lnglat = typeof req.session.currentUser.location !== 'undefined' ? req.session.currentUser.location : [];

    const { name, phone, address_1, address_2, suburb, city, zipcode, tag, is_default } = req.body;

    var currentUserId = req.session.currentUser.id;

    //Check if user has previous addresses.
    const countOfAddressesforUser = await models.Address.count({ where: { user_id: currentUserId } });

    var def = is_default === 'on' ? true : false;

    let isDefault = countOfAddressesforUser === 0 ? true : def;

    if (isDefault && countOfAddressesforUser !== 0) {
        // Get All Ids for previous addresses
        var existingAddressIds = await models.Address.findAll({
            where: { user_id: currentUserId },
            attributes: ['id']
        }).then(existingAddresses => {
            var ids = [];

            if (existingAddresses instanceof Array) {
                existingAddresses.forEach(address => {
                    ids.push(address.dataValues.id);
                });
            } else {
                ids.push(existingAddresses.dataValues.id);
            }

            return ids;
        })
            .catch(err => console.log(err));

        const update = await models.Address.update({ is_default: false }, { where: { id: existingAddressIds } });
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


router.get('/my-cards', async function (req, res) {
    var currentUserId = req.session.currentUser.id;

    var existingCardsforUser = await models.Card.findAll({
        where: { user_id: currentUserId }
    }).then(existingCards => {
        var cards = [];

        if (existingCards instanceof Array) {
            existingCards.forEach(card => {

                var cardNumberFormatted = utilHelpers.getLast4DigitsOfCard(card.dataValues.card_number);

                var cardObject = {
                    cardNumberFormatted: cardNumberFormatted,
                    exp: card.dataValues.exp_date,
                    type: card.dataValues.type,
                    isDefault: card.dataValues.is_default
                }

                cards.push(cardObject);
            });
        } else {
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

    existingCardsforUser.sort(function (x, y) { return x - y });

    existingCardsforUser.reverse();

    res.render('CreditCards', {
        existingCardsforUser
    });
});

router.get('/add-card', async function (req, res) {
    currentUserId = req.session.currentUser.id;

    const countOfCardsforUser = await models.Card.count({ where: { user_id: currentUserId } });

    var isDisabled = countOfCardsforUser === 0 ? true : false;

    var isDefault = isDisabled ? true : false;

    res.render('AddCard', {
        isDisabled,
        isDefault
    });
});

router.post('/add-card', async function (req, res) {
    const cardTypes = [
        'VISA', 'MASTER CARD', 'AMEX'
    ];

    const { name, card_no, exp, cvc, is_default } = req.body;

    var currentUserId = req.session.currentUser.id;

    const countOfCardsForUser = await models.Card.count({ where: { user_id: currentUserId } });

    var def = is_default === 'on' ? true : false;

    let isDefault = countOfCardsForUser === 0 ? true : def;

    if (isDefault && countOfCardsForUser !== 0) {
        // Get All Ids for previous cards
        var existingCardIds = await models.Card.findAll({
            where: { user_id: currentUserId },
            attributes: ['id']
        }).then(existingCards => {
            var ids = [];

            if (existingCards instanceof Array) {
                existingCards.forEach(card => {
                    ids.push(card.dataValues.id);
                });
            } else {
                ids.push(existingCards.dataValues.id);
            }

            return ids;
        })
            .catch(err => console.log(err));

        const update = await models.Card.update({ is_default: false }, { where: { id: existingCardIds } });
    }

    const random = Math.floor(Math.random() * cardTypes.length);

    var cardType = cardTypes[random];

    var newCard = {
        user_id: currentUserId,
        cardholder_name: name,
        card_number: card_no,
        exp_date: exp,
        cvc: cvc,
        type: cardType,
        is_default: isDefault,
        createdAt: new Date(),
        updateddAt: new Date()
    }

    const cardCreated = await models.Card.create(newCard);

    res.redirect('/my-cards');
});

router.get('/review', async function (req, res) {
    const currentUserId = req.session.currentUser.id;
    const restaurantId = req.session.currentUser.restaurantId;

    var restaurantData = await models.Restaurant.findOne({ where: { id: restaurantId } })
        .then(restaurantItem => {
            return restaurantItem.dataValues;
        })
        .catch(err => console.log(err));

    console.log(restaurantData);


    res.render('Review', {
        restaurantData
    });
});

router.get('/done-review', function (req, res) {
    res.render('partials/dialogs/ReviewCompleted');
});

module.exports = router;