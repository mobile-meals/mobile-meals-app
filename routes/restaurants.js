const express = require('express');
const router = express.Router();

const models = require('../models');
const dish = require('../models/dish');
const utilHelpers = require('../helpers/utils');
// Welcome Page
router.get('/:id', async function (req, res) {
    var categoryIds = [];
    var categoryNames = [{name: 'Best Sellers', slug:'best-sellers', dishes:[]}];

    var restaurantData = await models.Restaurant.findOne({ where: { id: req.params.id }})
        .then(restaurant => {
            return {
                id: restaurant.id,
                name: restaurant.name,
                imageUrl: restaurant.image_url,
                rating: parseFloat(restaurant.rating).toFixed(1),
                operationTimes: {
                    open: restaurant.open_time,
                    close: restaurant.close_time,
                }
            };
        })
        .catch(err => console.log(err));

    var dishes = await models.Dish.findAll({ where: { restaurant_id: req.params.id }})
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

    
    var categoriesAndDishes = await models.DishCategory.findAll({ where: { id: categoryIds }})
        .then(categoriesRecieved => {
            categoriesRecieved.forEach((category) =>{
                categoryNames.push({
                    id:category.id,
                    name: category.name,
                    slug: utilHelpers.slugifyText(category.name),
                    dishes: []
                });
            });
            return categoryNames;
        })
        .catch(err => console.log(err));

    
    dishes.forEach((dish) => {
        categoriesAndDishes.forEach((categoryAndDish)=>{
            if (dish.category_id === categoryAndDish.id){
                categoryAndDish.dishes.push(dish);
            }
        });
    });

    // add 2 random dishes to best sellers category
    var max = dishes.length;
    var randNum1 = Math.floor(Math.random() * max);
    var randNum2 = 0;

    do{
        randNum2 = Math.floor(Math.random() * max);
    }while (randNum1 === randNum2)

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

    var dishData = await models.Dish.findOne({ where: { id: req.params.dishId }})
        .then(dishRecieved => {
            return {
                id: dishRecieved.id,
                name: dishRecieved.name,
                imageUrl: dishRecieved.image_url,
                description: dishRecieved.description,
                price: parseFloat(dishRecieved.price).toFixed(2),
                restaurantId: dishRecieved.restaurantId,
                categoryId: dishRecieved.categoryId,
            };
        })
        .catch(err => console.log(err));

    var extraFromDB = await models.Extra.findAll({ where: { dish_id: req.params.dishId }})
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
    
    const { dishId, notes, quantity } = req.body;

    var extras = (typeof req.body['extras[]'] === 'undefined') ? []:req.body['extras[]'] ;

    var cartItem = {
        dishId: parseInt(dishId),
        qty: parseInt(quantity),
        notes: notes,
        extras:[]
    }

    extras.forEach((id) => {
        cartItem.extras.push(parseInt(id));
    });

    req.session.currentUser.cartItems.push(cartItem);

    res.redirect('/cart');
});

module.exports = router;