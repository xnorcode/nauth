const express = require("express");
const cors = require("cors");
const compression = require('compression');
const winston = require('winston');

// import Environment Vars from .env file
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const app = express();
app.use(compression());

// - Write all logs with level `error` and below to `error.log`
// - Write all logs with level `info` and below to `combined.log`
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use(cors()); // add CORS

app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// global error handler
const errorHandler = require('./app/middleware/error-handler');
app.use(errorHandler);

const db = require("./app/models");
// For production app, uncomment below sync() and comment out syn() with drop
db.sequelize.sync();
// Only used in development for dropping tables and re-sync database
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


// include app routes here
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);


// set port, listen for requests
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 4000;
app.listen(PORT, () => {
  console.log(`App listening at Port: ${PORT}`);
});