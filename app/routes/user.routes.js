const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");


module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });


  //USER EMBEDDED ENDPOINT
  // app.post("/api/v1/goals", controller.goals);
  // app.post("/api/v1/primary-interest-one", controller.primaryInterestOne);
  // app.post("/api/v1/primary-interest-two", controller.primaryInterestTwo);
  // app.post("/api/v1/primary-interest-three", controller.primaryInterestThree);
  // app.post("/api/v1/hear-about-us", controller.hearAboutUs);
  app.post("/api/v1/user-goals", controller.userGoals);
  app.post("/api/v1/user-recommendation",  controller.userRecommendation);
  app.post("/api/v1/one-time-payment", controller.oneTime);
  app.post("/api/v1/subscription-payment", controller.subscription);
  app.post("/api/v1/stripe-webhook", controller.stripeWebhook);
  /////

  app.get("/api/v1/users", controller.getAllUsers);
  app.get("/api/v1/user/:id", controller.getUser);


  

};