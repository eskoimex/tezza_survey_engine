const mongoose = require("mongoose");
const Survey2 = mongoose.model(
  "Survey2",
  new mongoose.Schema({ }, { strict: false })
);
module.exports = Survey2

