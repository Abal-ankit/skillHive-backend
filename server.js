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
const cors = require('cors');
require("dotenv").config();
const app = express();
const { sequelize } = require("./models");

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user")); // where user.js has the protected route
app.use("/api/challenges", require("./routes/challenges"));




sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
