const { signUpUser, signInUser } = require("../core/auth.core");
const { handleResError } = require("../utils/err.util");
const { validateSignInData} = require('../validators/auth.validator');


//SIGNUP
const signUp = async (req, res, next) => {    
   try { 
     //let { err, value } = await validateSignUpData(req.body);
    // if (err)  handleResError(res, 30, err);
      await signUpUser(req,res);
   } catch (e) {
    console.log(e.message)
       handleResError(res, 30, e.message)
 ;
  }
 };
 

//SIGNIN
const signIn = async (req, res, next) => {    
    try { 
      // let { err, value } = await validateSignInData(req.body);
      // if (err) return  handleResError(res, 30, err) ;
       await signInUser(req,res);
    } catch (e) {
       console.log(e.message)
           handleResError(res, 30, e.message)
;
   }
}  



module.exports = { signUp, signIn }