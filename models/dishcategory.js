'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DishCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DishCategory.hasMany(models.Dish, {
        foreignKey: 'category_id',
      })
    }
  };
  DishCategory.init({
    name: DataTypes.STRING,
    image_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'DishCategory',
  });
  return DishCategory;
};