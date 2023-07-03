const controller = require("../controllers/survey.controller");


module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/v1/post_survey_data", controller.postSurveyData);
  app.post("/api/v1/post_survey_data2", controller.postSurveyData2);

  app.get('/api/v1/survey_data', controller.surveyData)
  app.get('/api/v1/patient_survey_question_answer/:respondent_id', controller.patientQuestionAndAnswer)
  app.get('/api/v1/patient_survey_question_answer/:respondent_id/:survey_id', controller.patientSurveyQuestionAndAnswer)
  app.get('/api/v1/respondents', controller.getAllRespondents)

  app.get('/api/v1/current_sorted_survey_data', controller.currentSortedSurveyDataAnalytics)
  app.get('/api/v1/current_sorted_survey_data2', controller.currentSortedSurveyDataAnalytics2)

  app.post('/api/v1/sorted_survey_data', controller.sortedSurveyDataAnalytics)
  app.post('/api/v1/sorted_survey_data2', controller.sortedSurveyDataAnalytics2)

  app.get('/api/v1/survey_by_date_range/:start_date/:end_date', controller.surveyByDateRange)
  app.get('/api/v1/survey_by_date_range2/:start_date/:end_date', controller.surveyByDateRange2)

  ///////////////////////////////////////////////////////////
  app.get("/api/v1/surveys", controller.getAllSurveys);
  app.delete("/api/v1/survey/:id", controller.deleteSurvey);


////////////////////////////////////////////
app.post('/api/v1/survey_access_method', controller.surveyAccessMethod)
app.get('/api/v1/survey_access_method_analytics', controller.surveyAccessMethodAnalytics)
app.get('/api/v1/survey_access_method_analytics_date_range/:start_date/:end_date', controller.surveyAccessMethodAnalyticsDateRange)


};