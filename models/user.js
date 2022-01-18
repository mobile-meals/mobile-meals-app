'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Address, {
        foreignKey: 'user_id',
      });

      User.hasMany(models.Card, {
        foreignKey: 'user_id',
      });

      User.hasMany(models.Order, {
        foreignKey: 'user_id',
      });

      User.hasOne(models.Reward, {
        foreignKey: 'user_id',
      });
    }
  };
  User.init({
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    user_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};