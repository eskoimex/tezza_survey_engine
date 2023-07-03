const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.survey = require("./survey.model");
db.survey2 = require("./survey2.model");
db.surveyAccessMethod = require("./survey_access_method.model");


module.exports = db;