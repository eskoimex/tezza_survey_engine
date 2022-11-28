const { TokenExpiredError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    role: { type: String, enum: ['admin', 'patient'], default: 'admin' },
    companyId: String,
    token: String
  })
);
module.exports = User