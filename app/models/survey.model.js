const mongoose = require("mongoose");
const Survey = mongoose.model(
  "Survey",
  new mongoose.Schema({ }, { strict: false })
);
module.exports = Survey

// const mongoose = require("mongoose");
// const Survey_data_test2 = mongoose.model(
//   "Survey_data_test2",
//   new mongoose.Schema({ }, { strict: false })
// );
// module.exports = Survey_data_test2