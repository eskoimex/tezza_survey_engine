const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const { handleResError } = require("./../utils/err.util");
const { handleResSuccess } = require("./../utils/success.util");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  console.log(req.body.username)
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      //res.status(500).send({ message: err });
       handleResError(res, 30, err);
      return;
    }
    if (user ) {
      //res.status(400).send({ message: "Failed! Username is already in use!" });
       handleResError(res, 30, "Failed! Username is already in use!");
       return;
    }
    
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        //res.status(500).send({ message: err });
         handleResError(res, 30, err);
        return;
      }
     if (user) {
      //  message = {
      //   data: {
      //         status: "success"
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Email is already in use!", message);
      handleResError(res, 30, "Email is already in use!");

        return;
      }
      next();
    });
  });
};

checkDuplicateEmail = (req, res, next) => {
    
    // Email
    let email = req.body.email

    // if(email != "")

    User.findOne({
      email: email
    }).exec((err, user) => {
      if (err) {
        //res.status(500).send({ message: err });
         handleResError(res, 30, err);
        return;
      }
      if (user) {
      //  message = {
      //   data: {
      //         status: "success"
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Email is already in use!", message);
      handleResError(res, 30, "Email is already in use!");

        return;
      }
      next();
    });
};

// 

checkDuplicateEmailLogic = (email) => {
  User.findOne({
    email: email
  }).exec((err, user) => {
    if (err) {
      return false;
    }
    if (user) {
      return true
    }
  });
};

checkRolesExisted = (req, res, next) => {
  console.log(req.body.roles)
  console.log(ROLES)
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles)) {
        // res.status(400).send({
        //  // message: `Failed! Role ${req.body.roles[i]} does not exist!`

        // });
         handleResError(res, 30, `Failed! Role ${req.body.roles[i]} does not exist!`);

        return;
      }
    }
  }
  next();
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateEmail,
  checkRolesExisted
};
module.exports = verifySignUp;