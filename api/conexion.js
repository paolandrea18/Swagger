const { Sequelize } = require("sequelize");
require("dotenv").config();

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.DB_HOST;
const db = process.env.DIALECT;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: db,
});

sequelize
  .authenticate()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error(`Error de conexion: ${err}`));

module.exports = sequelize;
