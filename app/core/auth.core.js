const db = require("../models");
const { handleResError } = require("../utils/err.util");
const { handleResSuccess } = require("../utils/success.util");
const { v4: uuidv4 } = require('uuid')
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var randomString = require('random-string');
const dotenv = require("dotenv")
dotenv.config()

// const moment = require('moment');
// const { userServices, tokenServices } = require("../services");


//SIGNUP
const signUpUser = async (req, res, next) => {

  try {

   const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: "admin",
      companyId: randomString({length: 16, special: false})
    });
    user.save((err, user) => {
      if (err) {
          handleResError(res, 30, err);
          return;
      }

              const  {_id, email} = user;

              const token = jwt.sign({_id, email, tokenId:uuidv4()}, process.env.RESET_PASSWORD_SECRET, {expiresIn: '10m' });

              User.findOneAndUpdate({ _id: _id }, { $set: {token: token} })
              .then( async ()=>{

                   message = {
                      data: {
                            user: user
                      },
                    };
      
              handleResSuccess(res, res.statusCode, "SignUp successful" , message);
            }).catch(error=> {
                   let err = `Error : ${error}`;
                    handleResError(res, 30, err);      
              });
            
            });
      

  } catch (error) {
    
      err=`Error: ${error}`,
    
       handleResError(res, 30, err);
  }
};



//SIGNIN
const signInUser = async (req, res, next) => {
  let err;
try{
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
          handleResError(res, 30, err);
         return;
      }
      if (!user) {
         err = "User Not found."
          handleResError(res, 30, err);
         return;
      }
      let password = user.password
      //console.log(password)
      if (password == undefined) {
          err = "Password not found."
          handleResError(res, 30, err);
          return;
       }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
       
        err = "Invalid Password!"
        handleResError(res, 30, err);
        return;

      }

      var token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 86400 // 24 hours
      });
    
    //   message = {
    //     data: {
    //           id: user._id,
    //           username: user.username,
    //           email: user.email,
    //           accessToken: token,

    //   };
    // }
    // handleResSuccess(res, res.statusCode, "Login successful" , message);
    
    res.json({ 
      "message":"Login successful",
      "user": user,
      "token": token, 
      // "token_expiration_date":exp*1000,
      "status_code": res.statusCode
  })

})

  } catch (error) {
    err = {
      message: `Error: ${error}`,
    };
       handleResError(res, 30, err);
  }
};



module.exports = { 
  signUpUser,
  signInUser
}