// import Environment Vars from .env file for sequelize migration
if(!process.env.DEVELOPMENT_DB_USERNAME) require('dotenv').config();

module.exports = {
    "development": {
      username: process.env.DEVELOPMENT_DB_USERNAME,
      password: process.env.DEVELOPMENT_DB_PASSWORD,
      database: "nauth",
      host: "localhost",
      dialect: "mysql",
      operatorsAliases: 0,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
};