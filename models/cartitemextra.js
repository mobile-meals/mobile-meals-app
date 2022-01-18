'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItemExtra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItemExtra.belongsTo(models.CartItem, {
        foreignKey: 'cart_item_id',
        onDelete: 'CASCADE'
      });

      CartItemExtra.belongsTo(models.Extra, {
        foreignKey: 'extra_id',
        onDelete: 'CASCADE'
      });
    }
  };
  CartItemExtra.init({
    cart_item_id: DataTypes.INTEGER,
    extra_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'CartItemExtra',
  });
  return CartItemExtra;
};