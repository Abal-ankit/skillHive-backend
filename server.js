// const sequelize = require('./config/db');
// async function authenticate() {
//     try {
//         await sequelize.authenticate();
//         console.log("Connection has been established successfully.");
//     } catch (error) {
//         console.error("Unable to connect to the database:", error);
//     }
// }

// authenticate();

const express = require("express");
require("dotenv").config();
const app = express();
const { sequelize } = require("./models");

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));


app.use("/api/user", require("./routes/user")); // where user.js has the protected route




sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
