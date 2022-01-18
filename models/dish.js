'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dish.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        onDelete: 'CASCADE'
      });

      Dish.belongsTo(models.DishCategory, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE'
      });

      Dish.hasMany(models.Extra, {
        foreignKey: 'dish_id',
      });

      Dish.hasMany(models.CartItem, {
        foreignKey: 'dish_id',
      });

      Dish.hasMany(models.FavouriteDish, {
        foreignKey: 'dish_id',
      });
    }
  };
  Dish.init({
    name: DataTypes.STRING,
    image_url: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    restaurant_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dish',
  });
  return Dish;
};