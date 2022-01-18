'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavouriteDish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FavouriteDish.belongsTo(models.Dish, {
        foreignKey: 'dish_id',
        onDelete: 'CASCADE'
      });

      FavouriteDish.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  };
  FavouriteDish.init({
    dish_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FavouriteDish',
  });
  return FavouriteDish;
};