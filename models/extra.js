'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Extra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Extra.belongsTo(models.Dish, {
        foreignKey: 'dish_id',
        onDelete: 'CASCADE'
      });
    }
  };
  Extra.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    dish_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Extra',
  });
  return Extra;
};