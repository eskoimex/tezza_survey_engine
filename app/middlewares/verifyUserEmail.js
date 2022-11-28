const db = require("../models");
const User = db.user;
const { handleResError } = require("../utils/err.util");


checkIfUserEmailIsNotVerified= (req, res, next) => {

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      
       if (!user.isEmailVerified) {
        err = {
            message : 'Please verify your email to proceed. '
          };
           handleResError(res, 30, err);
          return;
      }
      next();

  })
  .catch(() => {
  
        err = {
          message : 'User does not exist.'
        };
         handleResError(res, 30, err);
      
        next();

  });

  
};

const verifyUserEmail = {
  checkIfUserEmailIsNotVerified: checkIfUserEmailIsNotVerified
};

module.exports = verifyUserEmail;
