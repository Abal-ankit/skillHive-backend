const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require('../models/index');

const register = async (req, res, next) => {
  try {
    const { userName, name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, name, email, password: hash });
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    error.location = "register Controller";
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, userName: user.name },
      process.env.JWT_SECRET
    );
    res.status(200).json({ token, user });
  } catch (error) {
    error.location = "login Controller";
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await User.findByPk(userId);
    const { password: pass, ...profile } = result.dataValues;

    return res.status(200).json(profile);
  } catch (error) {
    error.location = "getProfile Controller";
    next(error);
  }
};

module.exports = { register, login, getProfile };
