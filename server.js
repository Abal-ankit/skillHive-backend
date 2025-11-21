const express = require("express");
const cors = require('cors');
require("dotenv").config();
const app = express();
const http = require('http');
const { Server } = require('socket.io');
// const { sequelize } = require("./models");
const jwt = require('jsonwebtoken');
const handleError = require("./middlewares/errorHandler");
const sequelize = require("./config/db");

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/admin", require("./routes/admin"));

app.use(handleError);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // store user info for later
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

require("./socket.io/connection")(io); 

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
