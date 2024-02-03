// database/connection.js
const { Sequelize } = require('sequelize');
const pg = require('pg')
require('dotenv').config()
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectModule: pg,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

module.exports =  sequelize;
