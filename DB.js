// database/connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config()
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

module.exports =  sequelize;
