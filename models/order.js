'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });

      Order.belongsTo(models.Address, {
        foreignKey: 'address_id',
        onDelete: 'CASCADE'
      });

      Order.belongsTo(models.Card, {
        foreignKey: 'payment_type_id',
        onDelete: 'CASCADE'
      });

      Order.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        onDelete: 'CASCADE'
      });

      Order.hasMany(models.CartItem, {
        foreignKey: 'order_id'
      });
    }
  };
  Order.init({
    notes: DataTypes.STRING,
    status: DataTypes.STRING,
    address_id: DataTypes.INTEGER,
    payment_type_id: DataTypes.INTEGER,
    sub_total: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    delivery_charge: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    restaurant_id: DataTypes.INTEGER,
    order_date_time: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};