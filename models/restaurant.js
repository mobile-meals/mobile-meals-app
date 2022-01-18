'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.hasMany(models.Dish, {
        foreignKey: 'restaurant_id',
      });

      Restaurant.hasMany(models.Order, {
        foreignKey: 'restaurant_id'
      });
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    image_url: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    orders: DataTypes.INTEGER,
    open_time: DataTypes.STRING,
    close_time: DataTypes.STRING,
    is_promotion: DataTypes.BOOLEAN,
    promotion_text: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};