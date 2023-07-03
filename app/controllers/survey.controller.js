const { insertSurveyData, 
     insertSurveyData2, 
     retrieveAllRespondents,
     retrievePatientQuestionAndAnswer,
     retrievePatientSurveyQuestionAndAnswer, 
     retrieveSurveyDataAnalytics,
     retrieveAllSurveys,
     retrieveCurrentSortedSurveyDataAnalytics,
     retrieveCurrentSortedSurveyDataAnalytics2,
     retrieveSortedSurveyDataAnalytics,
     retrieveSortedSurveyDataAnalytics2,
     retrieveSurveyByDateRange,
     retrieveSurveyByDateRange2,
     removeSurvey,
     sendSurveyAccessMethod,
     getSurveyAccessMethodAnalytics,
     getSurveyAccessMethodAnalyticsDateRange
    } = require("../core/survey.core");

const { handleResError } = require("../utils/err.util");


const postSurveyData = async (req, res, next) => {    
   try { 
      await insertSurveyData(req,res);
   } catch (e) {
    console.log(e.message)
       handleResError(res, 30, e.message)
 ;
  }
 };
 
 
const postSurveyData2 = async (req, res, next) => {    
    try { 
       await insertSurveyData2(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message)
  ;
   }
  };


  
 const getAllRespondents = async (req, res, next) => {    
    try { 
       await retrieveAllRespondents(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message)
  ;
   }
  };


 const getAllSurveys = async (req, res, next) => {    
    try { 
       await retrieveAllSurveys(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message)
  ;
   }
  };


  const patientQuestionAndAnswer = async (req, res, next) => {    
    try { 
       await retrievePatientQuestionAndAnswer(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };

  const patientSurveyQuestionAndAnswer = async (req, res, next) => {    
    try { 
       await retrievePatientSurveyQuestionAndAnswer(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };


  const surveyData = async (req, res, next) => {    
    try { 
       await retrieveSurveyDataAnalytics(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };

  
  const currentSortedSurveyDataAnalytics = async (req, res, next) => {    
    try { 
       await retrieveCurrentSortedSurveyDataAnalytics(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };


  const currentSortedSurveyDataAnalytics2 = async (req, res, next) => {    
    try { 
       await retrieveCurrentSortedSurveyDataAnalytics2(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };

  const sortedSurveyDataAnalytics = async (req, res, next) => {    
    try { 
       await retrieveSortedSurveyDataAnalytics(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };

  const sortedSurveyDataAnalytics2 = async (req, res, next) => {    
    try { 
       await retrieveSortedSurveyDataAnalytics2(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };

  const surveyByDateRange = async (req, res, next) => {    
    try { 
       await retrieveSurveyByDateRange(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };

  const surveyByDateRange2 = async (req, res, next) => {    
    try { 
       await retrieveSurveyByDateRange2(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message);
   }
  };


  const deleteSurvey = async (req, res, next) => {    
    try { 
       await removeSurvey(req,res);
    } catch (e) {
     console.log(e.message)
        handleResError(res, 30, e.message)
  ;
   }
  };

  const surveyAccessMethod = async (req, res, next) => {    
   try { 
      await sendSurveyAccessMethod(req,res);
   } catch (e) {
    console.log(e.message)
       handleResError(res, 30, e.message);
  }
 };

 const surveyAccessMethodAnalytics = async (req, res, next) => {    
   try { 
      await getSurveyAccessMethodAnalytics(req,res);
   } catch (e) {
    console.log(e.message)
       handleResError(res, 30, e.message);
  }
 };

 const surveyAccessMethodAnalyticsDateRange = async (req, res, next) => {    
   try { 
      await getSurveyAccessMethodAnalyticsDateRange(req,res);
   } catch (e) {
    console.log(e.message)
       handleResError(res, 30, e.message);
  }
 };



module.exports = { 
    postSurveyData, 
    postSurveyData2, 
    getAllRespondents,
    patientQuestionAndAnswer, 
    patientSurveyQuestionAndAnswer, 
    surveyData,
    getAllSurveys, 
    currentSortedSurveyDataAnalytics,
    currentSortedSurveyDataAnalytics2,
    sortedSurveyDataAnalytics,
    sortedSurveyDataAnalytics2,
    surveyByDateRange,
    surveyByDateRange2,
    deleteSurvey,
    surveyAccessMethod,
    surveyAccessMethodAnalytics,
    surveyAccessMethodAnalyticsDateRange 
}