const jwt = require("jsonwebtoken");
const db = require("../models");
const { handleResError } = require("./../utils/err.util");
const User = db.user;
const Role = db.role;
const dotenv = require("dotenv")

dotenv.config()

verifyToken = (req, res, next) => {
 // let token = req.headers["x-access-token"];
  const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    // return res.status(403).send({ message: "No token provided!" });
     handleResError(res, 30, "No token provided!");

  }
  // jwt.verify(token, process.env.SECRET, (err, decoded) => {
  //   if (err) {
  //     // return res.status(401).send({ message: "Unauthorized!" });
  //     console.log(err)
  //      handleResError(res, 30, "Unauthorized!");

  // }
   // req.userId = decoded.id;
    next();
 // });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      // res.status(500).send({ message: err });
       handleResError(res, 30, err);
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          // res.status(500).send({ message: err });
           handleResError(res, 30, err);
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        // res.status(403).send({ message: "Require Admin Role!" });
         handleResError(res, 30, "Require Admin Role!");
        return;
      }
    );
  });
};

isHost= (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
     // res.status(500).send({ message: err });
       handleResError(res, 30, err);
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          //res.status(500).send({ message: err });
           handleResError(res, 30, err);
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "host") {
            next();
            return;
          }
        }
        //res.status(403).send({ message: "Require Host Role!" });
         handleResError(res, 30, "Require Host Role!");
        return;
      }
    );
  });
};
const authJwt = {
  verifyToken,
  isAdmin,
  isHost
};
module.exports = authJwt;