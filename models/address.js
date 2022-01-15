'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  };
  Address.init({
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address_1: DataTypes.STRING,
    address_2: DataTypes.STRING,
    suburb: DataTypes.STRING,
    city: DataTypes.STRING,
    post_code: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN,
    tag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};