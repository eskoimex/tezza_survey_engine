
// const { getGoals, getPrimaryInterestOne, getPrimaryInterestTwo, getPrimaryInterestThree, getHearAboutUs, sun} = require("../core/user.core");
const {retrieveUser, retrieveAllUsers, getUserGoals, createUserGoals, getUserRecommendation, oneTimePayment, subscriptionPayment, webhook} = require("../core/user.core");
const { handleResError } = require("../utils/err.util");




const getAllUsers = async (req, res, next) => {    
  try { 
   // if (err)  handleResError(res, 30, err);
     await retrieveAllUsers(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message)
;
 }
} 

const getUser = async (req, res, next) => {    
  try { 
   // if (err)  handleResError(res, 30, err);
     await retrieveUser(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message)
;
 }
} 

const userGoals = async (req, res, next) => {    
  try { 
   // if (err)  handleResError(res, 30, err);
     await createUserGoals(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message)
;
 }
} 


const userRecommendation = async (req, res, next) => {    
  try { 
   // if (err)  handleResError(res, 30, err);
     await getUserRecommendation(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message);
 }
}  

const subscription = async (req, res, next) => {    
  try { 
    //if (err)  handleResError(res, 30, err);
     await subscriptionPayment(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message)
;
 }
}  



const oneTime = async (req, res, next) => {    
  try { 
    //if (err)  handleResError(res, 30, err);
     await oneTimePayment(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message)
;
 }
}  


const stripeWebhook = async (req, res, next) => {    
  try { 
    //if (err)  handleResError(res, 30, err);
     await webhook(req,res);
  } catch (e) {
   console.log(e.message)
      handleResError(res, 30, e.message)
;
 }
}  

// module.exports = { goals, primaryInterestOne, primaryInterestTwo, primaryInterestThree, hearAboutUs, subscription}
module.exports = {getUser, getAllUsers,  userGoals, userRecommendation, oneTime, subscription, stripeWebhook}