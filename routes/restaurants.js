const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const models = require('../models');
const dish = require('../models/dish');
const utilHelpers = require('../helpers/utils');
const { checkIdinArray, getObjectByIdFromArray } = require('../helpers/utils');
// Welcome Page
router.get('/:id', async function (req, res) {
    var categoryIds = [];
    var categoryNames = [{ name: 'Best Sellers', slug: 'best-sellers', dishes: [] }];
    const currentUserId = req.session.currentUser.id;

    var restaurantData = await models.Restaurant.findOne({ where: { id: req.params.id } })
        .then(restaurant => {
            return {
                restaurantId: restaurant.id,
                name: restaurant.name,
                imageUrl: restaurant.image_url,
                rating: parseFloat(restaurant.rating).toFixed(1),
                isFavourite: false,
                operationTimes: {
                    open: restaurant.open_time,
                    close: restaurant.close_time,
                }
            };
        })
        .catch(err => console.log(err));



    var isFavourite = await models.FavouriteRestaurant.findOne({
        where: {
            user_id: currentUserId,
            restaurant_id: restaurantData.restaurantId
        }
    })
        .then(favRes => {
            return favRes.dataValues;
        })
        .catch(err => console.log(err));

    if (typeof isFavourite !== 'undefined') {
        restaurantData.isFavorite = true;
    } else {
        restaurantData.isFavorite = false;
    }

    var dishes = await models.Dish.findAll({ where: { restaurant_id: req.params.id } })
        .then(dishesRecieved => {
            var dishesArray = [];

            dishesRecieved.forEach((dish) => {
                categoryIds.push(dish.category_id);

                dishesArray.push({
                    id: dish.id,
                    name: dish.name,
                    imageUrl: dish.image_url,
                    description: dish.description,
                    price: parseFloat(dish.price).toFixed(2),
                    category_id: dish.category_id
                });
            });

            return dishesArray;
        })
        .catch(err => console.log(err));

    categoryIds = categoryIds.filter((v, i, a) => a.indexOf(v) === i);


    var categoriesAndDishes = await models.DishCategory.findAll({ where: { id: categoryIds } })
        .then(categoriesRecieved => {
            categoriesRecieved.forEach((category) => {
                categoryNames.push({
                    id: category.id,
                    name: category.name,
                    slug: utilHelpers.slugifyText(category.name),
                    dishes: []
                });
            });
            return categoryNames;
        })
        .catch(err => console.log(err));


    dishes.forEach((dish) => {
        categoriesAndDishes.forEach((categoryAndDish) => {
            if (dish.category_id === categoryAndDish.id) {
                categoryAndDish.dishes.push(dish);
            }
        });
    });

    // add 2 random dishes to best sellers category
    var max = dishes.length;
    var randNum1 = Math.floor(Math.random() * max);
    var randNum2 = 0;

    do {
        randNum2 = Math.floor(Math.random() * max);
    } while (randNum1 === randNum2)

    categoriesAndDishes[0].dishes.push(dishes[randNum1]);
    categoriesAndDishes[0].dishes[0].orderCount = 14;
    categoriesAndDishes[0].dishes.push(dishes[randNum2]);
    categoriesAndDishes[0].dishes[1].orderCount = 25;
    // End

    res.render('SingleRestaurant', {
        restaurantData,
        categoriesAndDishes
    });
});

router.get('/:resId/dish/:dishId', async function (req, res) {
    var extras = [];
    const currentUserId = req.session.currentUser.id;

    var dishData = await models.Dish.findOne({ where: { id: req.params.dishId } })
        .then(dishRecieved => {
            return {
                id: dishRecieved.id,
                name: dishRecieved.name,
                imageUrl: dishRecieved.image_url,
                description: dishRecieved.description,
                price: parseFloat(dishRecieved.price).toFixed(2),
                isFavorite:false,
                restaurantId: dishRecieved.restaurant_id,
                categoryId: dishRecieved.categoryId,
            };
        })
        .catch(err => console.log(err));

    var isFavourite = await models.FavouriteDish.findOne({
        where: {
            user_id: currentUserId,
            dish_id: dishData.id
        }
    })
        .then(favDish => {
            return favDish.dataValues;
        })
        .catch(err => console.log(err));

    if (typeof isFavourite !== 'undefined') {
        dishData.isFavorite = true;
    } else {
        dishData.isFavorite = false;
    }

    var extraFromDB = await models.Extra.findAll({ where: { dish_id: req.params.dishId } })
        .then(extrasRecieved => {
            extrasRecieved.forEach(item => {
                extras.push({
                    id: item.id,
                    name: item.name,
                    slug: utilHelpers.slugifyText(item.name),
                    price: parseFloat(item.price).toFixed(2)
                });
            });

        })
        .catch(err => console.log(err));

    res.render('SingleDish', {
        dishData,
        extras
    });
});

router.post('/add-to-cart', async function (req, res) {

    const { dishId, notes, quantity, restaurantId } = req.body;

    if (typeof req.session.currentUser.restaurantId !== 'undefined') {
        if (req.session.currentUser.restaurantId !== restaurantId) {
            req.session.currentUser.restaurantId = restaurantId;
            req.session.currentUser.cartItems = [];
        }
    } else {
        req.session.currentUser.restaurantId = restaurantId;
    }

    var extras = (typeof req.body['extras[]'] === 'undefined') ? [] : req.body['extras[]'];

    cartItemId = uuidv4();

    var cartItem = {
        cartItemId: cartItemId,
        dishId: parseInt(dishId),
        qty: parseInt(quantity),
        notes: notes,
        extras: []
    }

    if (typeof extras !== 'string') {
        extras.forEach((id) => {
            cartItem.extras.push(parseInt(id));
        });
    } else {
        cartItem.extras.push(parseInt(extras));
    }

    req.session.currentUser.cartItems.push(cartItem);

    res.redirect('/cart');
});


router.post('/edit-cart-item', async function (req, res) {

    const { cartItemId, notes, quantity } = req.body;

    var cartItemInSession = req.session.currentUser.cartItems.find(obj => {
        return obj.cartItemId === cartItemId;
    });

    var cartItemInSessionIndex = req.session.currentUser.cartItems.findIndex(obj => {
        return obj.cartItemId === cartItemId;
    });

    req.session.currentUser.cartItems.splice(cartItemInSessionIndex, 1);

    var extras = (typeof req.body['extras[]'] === 'undefined') ? [] : req.body['extras[]'];

    var cartItem = {
        cartItemId: cartItemId,
        dishId: parseInt(cartItemInSession.dishId),
        qty: parseInt(quantity),
        price: "0.00",
        notes: notes,
        extras: []
    }

    if (typeof extras !== 'string') {
        extras.forEach((id) => {
            cartItem.extras.push(parseInt(id));
        });
    } else {
        cartItem.extras.push(parseInt(extras));
    }

    var priceForExtras = 0.00;

    for (const extra of cartItem.extras) {
        var extraItemData = await models.Extra.findOne({ where: { id: extra } })
            .then(extraItemRecieved => {
                return extraItemRecieved.dataValues;
            })
            .catch(err => console.log(err));

        priceForExtras += parseFloat(extraItemData.price);
    }

    var priceForDish = await models.Dish.findOne({ where: { id: cartItem.dishId } })
        .then(extraItemRecieved => {
            return extraItemRecieved.dataValues.price;
        })
        .catch(err => console.log(err));

    cartItem.price = parseFloat((priceForDish * cartItem.qty) + priceForExtras).toFixed(2);

    req.session.currentUser.cartItems.push(cartItem);

    res.redirect('/cart');
});

router.post('/delete-cart-item', async function (req, res) {

    const { cartItemId } = req.body;

    var cartItemInSessionIndex = req.session.currentUser.cartItems.findIndex(obj => {
        return obj.cartItemId === cartItemId;
    });

    req.session.currentUser.cartItems.splice(cartItemInSessionIndex, 1);


    console.log("Cart Items in Session when deleted: ", req.session.currentUser.cartItems);

    res.redirect('/cart');
});


module.exports = router;