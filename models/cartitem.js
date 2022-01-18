'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE'
      });

      CartItem.belongsTo(models.Dish, {
        foreignKey: 'dish_id',
        onDelete: 'CASCADE'
      });

      CartItem.hasMany(models.CartItemExtra,{
        foreignKey: 'cart_item_id'
      });
    }
  };
  CartItem.init({
    dish_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    note: DataTypes.STRING,
    order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};