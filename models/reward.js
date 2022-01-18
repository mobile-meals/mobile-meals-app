'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reward.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  };
  Reward.init({
    user_id: DataTypes.INTEGER,
    points: DataTypes.FLOAT,
    tier: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};