const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mm-db', 'user', 'pass', {
  dialect: 'sqlite',
  host: './mmdb.sqlite'
})

module.exports = sequelize;