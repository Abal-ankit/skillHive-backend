require("dotenv").config();
const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

mongoose
  .connect("mongodb://127.0.0.1:27017/skillhive")
  .then(() => console.log(`MongoDb connected!`))
  .catch((err) => console.log("Error connecting mongoDb: ", err));

module.exports = sequelize;
