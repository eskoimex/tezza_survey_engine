const mongoose = require("mongoose");
const SurveyAccessMethod = mongoose.model(
  "survey_access_method",
  new mongoose.Schema({ }, { strict: false })
);
module.exports = SurveyAccessMethod

