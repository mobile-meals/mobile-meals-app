'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  };
  Card.init({
    user_id: DataTypes.INTEGER,
    cardholder_name: DataTypes.STRING,
    card_number: DataTypes.STRING,
    exp_date: DataTypes.STRING,
    cvc: DataTypes.INTEGER,
    type: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};