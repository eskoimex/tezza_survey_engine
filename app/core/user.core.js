const db = require("../models");
const { handleResError } = require("../utils/err.util");
const { handleResSuccess } = require("../utils/success.util");
const { uuid } = require('uuidv4');
const StripeService = require('../services/stripe')
const UserService = require('../services/user')
const SubscriptionService = require('../services/subscription')
const GoalService = require('../services/goal')

const User = db.user;
const Goal = db.goal;

const dotenv = require("dotenv")

dotenv.config()

 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const retrieveAllUsers = async (req, res, next) => {
  //Category.find()
  User.find()
  .then(user => {
      message = {
          data: {
            "user": user,
          },
        };
        handleResSuccess(res, res.statusCode, "User Content Retrieved" , message);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user."
      });
  });

};

const retrieveUser = async (req, res, next) => {
  //Category.find()
  const id = req.params.id;
console.log(id)
  User.findById(id)
  .then(user => {
        message = {
          data: {
            "user": user,
          },
        };
        handleResSuccess(res, res.statusCode, "User Content Retrieved" , message);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user."
      });
  });

};


const getUserGoals = async (req, res, next) => {
  let goal = await GoalService.getGoalByUserId(req.body.userId)
  console.log(goal)
}


const createUserGoals = async (req, res, next) => {
  let err;
  try {
    user = await UserService.getUserById(req.body.userId)
//     let goals = await GoalService.getGoalsById(req.body.goals)
// goals.map(goal => goal.name);
//     //             console.log(goals)
// console.log(goals)
  if (user) {

        if (req.body.goals) {
          console.log(req.body.goals)
          let dgaols = [ 4,5 ]
          Goal.find(
            {
              id: { $in: req.body.goals }
            },
            (err, goals) => {
              if (err) {            
              res.status(500).send({ message: err });
                //   handleResError(res, 30, err);
                // return;
              }
           // goals = goals.map(goal => goal.name);
            console.log(goals)
            })
        }else{
          console.log("goals not found")
        }
      
    } else {
       
      handleResError(res, 30, "User does not exist");          
      return
  
 }
      //  let goalsId = req.body.goalsId

      //  if(req.body.userId == ''){
      //    handleResError(res, 30, "Id is required");      
      //   return;
      //  }

      //  await User.findOneAndUpdate(
      //   { _id: req.body.userId },
      //   { $set: { "userGoals": userGoals}}
      //  ).then( async ()=>{

      
      //   message = {
      //     data: {
      //       "userGoals": userGoals,
      //     },
      //   };
      //   handleResSuccess(res,  res.statusCode, "User Recommendation Updated!" , message);
               
      //  }).catch(error=> {
      //    err = {
      //      message: `Error : ${error.message}`,
      //    };
      //     handleResError(res, 30, err);      
      //    });
 } catch (error) {
   err = {
     message: `Error: ${error}`,
   };
      handleResError(res, 30, err);
 }
}

 const getUserRecommendation = async (req, res, next) => {
  let err;
  try {
       let userRecommendation = req.body
       console.log(userRecommendation)
       let id = req.body.id

       if(id == ''){
         handleResError(res, 30, "Id is required");      
        return;
       }
let goals = req.body.goals
       console.log( goals)
       
const arr = goals.map(object => object.id);
console.log(arr); 

Goal.find(
  {
    id: { $in: arr }
  },
  (err, goals) => {
    if (err) {            
       handleResError(res, 30, err);
      return;
    }
 goals = goals.map(goal => goal.name);
 
  console.log(goals)
  })

      //  await User.findOneAndUpdate(
      //   { _id: req.body.id },
      //   { $set: { "userRecommendation": userRecommendation}}
      //  ).then( async ()=>{

      
      //   message = {
      //     data: {
      //       "userRecommendation": userRecommendation,
      //     },
      //   };
      //   handleResSuccess(res,  res.statusCode, "User Recommendation Updated!" , message);
               
      //  }).catch(error=> {
      //    err = {
      //      message: `Error : ${error.message}`,
      //    };
      //     handleResError(res, 30, err);      
      //    });
 } catch (error) {
   err = {
     message: `Error: ${error}`,
   };
      handleResError(res, 30, err);
 }
}


const oneTimePayment = async (req, res, next) => {
  let err;
  try {
     
      //RETRIEVE SUBSCRIPTION
      subscription = await SubscriptionService.getSubscriptionById(req.body.subscriptionId)

      //RETRIEVE USER
      user = await UserService.getUserById(req.body.userId)
    
      if (user) {

           // Use an existing Customer ID if this is a returning customer.
           const customer = await StripeService.addNewCustomer(user.email)
           const ephemeralKey = await StripeService.createEphemeralKey(customer.id)
           const paymentIntent = await StripeService.createPaymentIntent(subscription.amount * 100, subscription.currency, customer.id)

            message = {
              data: {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,   
              },
            };

            handleResSuccess(res,  res.statusCode, "Customer created successfullly", message);
       
    
      } else {
       
        handleResError(res, 30, "Customer does not exist");          
        return
    
   }
 
  

 } catch (error) {
   err = {
     message: `Error: ${error}`,
   };
      handleResError(res, 30, err);
 }
}



const subscriptionPayment = async (req, res, next) => {
  let err;
  try {
     
      //RETRIEVE SUBSCRIPTION
      userSubscription = await SubscriptionService.getSubscriptionById(req.body.subscriptionId)

      //RETRIEVE USER
      user = await UserService.getUserById(req.body.userId)
    
      if (user) {

           // Use an existing Customer ID if this is a returning customer.
           const customer = await StripeService.addNewCustomer(user.email)
           const ephemeralKey = await StripeService.createEphemeralKey(customer.id)
           const setupIntent = await StripeService.createSetUptIntent(customer.id)

           //  const paymentMethodFuture = await StripeService.createFuturePaymentIntent(subscription.amount * 100, subscription.currency, customer.id)
         //https://stackoverflow.com/questions/62454487/stripe-v3-setupintents-and-subscriptions/62456011#62456011
           //////////////
          
           const subscriptionToPriceMap = {
              Monthly: process.env.MONTHLY_SUBSCRIPTION,
              Yearly: process.env.YEARLY_SUBSCRIPTION,
              Lifetime: process.env.LIFETIME_SUBSCRIPTION
            }
          
            const price = subscriptionToPriceMap[userSubscription.plan]
            let trialEndDate;
            let subscription;

            try {

              const trialPeriod = new Date().getTime() + 1000 * 60 * 60 * 24 * process.env.TRIAL_DAYS
               trialEndDate = new Date(trialPeriod)

              subscription = await StripeService.createSubscription(customer.id, price, trialEndDate)

          
              user.plan = subscription.plan
              user.hasTrial = true
              user.endDate = trialEndDate
              user.save()
          
            } catch (e) {
                console.log("Warning",e)
                handleResError(res, 30, "Internal Server Error");          
                return
            }

            //////////////////////////////

                            
                      data = {
                        customerId: customer.id,
                        plan: 'none',
                        endDate: null
                      }
                      
                        user =  await User.findOneAndUpdate({ _id: user.id }, { $set: data})

                        const isTrialExpired =
                        user.plan != 'none' && user.endDate < new Date().getTime()
                
                        if (isTrialExpired) {
                          console.log('trial expired')
                          user.hasTrial = false
                          user.save()
                        } else {
                          console.log(
                            'no trial information',
                            user.hasTrial,
                            user.plan != 'none',
                            user.endDate < new Date().getTime()
                          )
                        }
            console.log(subscription)


            message = {
              data: {
                subscriptionId: subscription.id,
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                trialEndDate: trialEndDate,
                // subscription: subscription,
                setupIntent: setupIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,   
              },
            };

            handleResSuccess(res,  res.statusCode, "Customer created successfullly", message);

    
      } else {
       
        handleResError(res, 30, "Customer does not exist");          
        return
    
   }
 
  

 } catch (error) {
   err = {
     message: `Error: ${error}`,
   };
      handleResError(res, 30, err);
 }
}



const webhook = async (req, res, next) => {
  let event

  try {
    event = Stripe.createWebhook(req.body, req.header('Stripe-Signature'))
  } catch (err) {
    console.log(err)
    return res.sendStatus(400)
  }

  const data = event.data.object

  console.log(event.type, data)
  switch (event.type) {
    case 'customer.created':
      console.log(JSON.stringify(data))
      break
    case 'invoice.paid':
      break
    case 'customer.subscription.created': {
      const user = await UserService.getUserByBillingID(data.customer)

      if (data.plan.id === process.env.PRODUCT_BASIC) {
        console.log('You are talking about basic product')
        user.plan = 'basic'
      }

      if (data.plan.id === process.env.PRODUCT_PRO) {
        console.log('You are talking about pro product')
        user.plan = 'pro'
      }

      user.hasTrial = true
      user.endDate = new Date(data.current_period_end * 1000)

      await user.save()

      break
    }
    case 'customer.subscription.updated': {
      // started trial
      const user = await UserService.getUserByBillingID(data.customer)

      if (data.plan.id == process.env.PRODUCT_BASIC) {
        console.log('You are talking about basic product')
        user.plan = 'basic'
      }

      if (data.plan.id === process.env.PRODUCT_PRO) {
        console.log('You are talking about pro product')
        user.plan = 'pro'
      }

      const isOnTrial = data.status === 'trialing'

      if (isOnTrial) {
        user.hasTrial = true
        user.endDate = new Date(data.current_period_end * 1000)
      } else if (data.status === 'active') {
        user.hasTrial = false
        user.endDate = new Date(data.current_period_end * 1000)
      }

      if (data.canceled_at) {
        // cancelled
        console.log('You just canceled the subscription' + data.canceled_at)
        user.plan = 'none'
        user.hasTrial = false
        user.endDate = null
      }
      console.log('actual', user.hasTrial, data.current_period_end, user.plan)

      await user.save()
      console.log('customer changed', JSON.stringify(data))
      break
    }
    default:
  }
  res.sendStatus(200)
}

const oneTimePaymentbk = async (req, res, next) => {
  let err;
  try {
       let body = req.body
       let user;
       let plan;
      let amount;
      let currency;
      let customer = {}
      let userId = req.body.userId
      let subscriptionId  = req.body.subscriptionId


      subscription = await SubscriptionService.getSubscriptionById(subscriptionId)
      plan = subscription.plan
      amount = subscription.amount;
      currency = subscription.currency;


      user = await UserService.getUserById(userId)
      email = user.email

      if (user) {
             

          ////CREATE CUSTOMER AND SETUP INTENT//////////////
  
        console.log(`id ${userId} exist. `)
        try {
             
          customer = await StripeService.addNewCustomer(email)

        
            const ephemeralKey = await stripe.ephemeralKeys.create(
              {customer: customer.id},
              {apiVersion: '2022-08-01'}
            );
           
                ///////////// CHECK OUT - ONE TIME//////////////
              //   var floor = Math.floor;
              //  amount = floor(parseFloat(amount));

              //   const paymentIntent = await stripe.paymentIntents.create({
              //     amount: amount,
              //     currency: currency,
              //     customer: customer.id,
              //     automatic_payment_methods: {
              //       enabled: true,
              //     },
              //   });

                const subscriptionToPriceMap = {
                  Monthly: process.env.MONTHLY_SUBSCRIPTION,
                  Yearly: process.env.YEARLY_SUBSCRIPTION,
                  Lifetime: process.env.LIFETIME_SUBSCRIPTION
  
                }
                
                  const price = subscriptionToPriceMap[plan]

                const session = await StripeService.createOneTimeCheckoutSession(customer.id, process.env.LIFETIME_SUBSCRIPTION)
                let CHECKOUT_SESSION_ID = session.id
                console.log("session",CHECKOUT_SESSION_ID)
                let success_url= `${process.env.HOST_URL}?session_id=${CHECKOUT_SESSION_ID}`,

                      message = {
                        data: {
                          customer: customer,
                          // paymentIntent: paymentIntent.client_secret,
                          ephemeralKey: ephemeralKey.secret,
                          customerId: customer.id,
                          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,   
                          success_url: success_url 
                        },
                      };

                      //return StripeService.redirectToCheckout(`sessionId: ${CHECKOUT_SESSION_ID}`)
                      handleResSuccess(res,  res.statusCode, "Customer created successfullly", message);
     
        } catch (e) {
          console.log(e)
          err = {
            message: `Error: ${e}`,
          };
             handleResError(res, 30, "Internal Server Error");          
             return
        }
    
      } else {
       
        handleResError(res, 30, "Customer does not exist");          
        return
    
   }
 
  

 } catch (error) {
   err = {
     message: `Error: ${error}`,
   };
      handleResError(res, 30, err);
 }
}

const subscriptionPaymentbk = async (req, res, next) => {
  let err;
  try {
       let body = req.body
       console.log(body)

      let email;
      let data;
      let user;
      let subscription;
      let plan;
      let customer = {}
      let userId = req.body.userId
      let subscriptionId  = req.body.subscriptionId


      subscription = await SubscriptionService.getSubscriptionById(subscriptionId)
      plan = subscription.plan


      user = await UserService.getUserById(userId)
      email = user.email

      if (user) {
        console.log(`id ${userId} exist. `)
        try {
             

          ////CREATE CUSTOMER AND SETUP INTENT//////////////
          // customer = await stripe.customers.create();
          // const ephemeralKey = await stripe.ephemeralKeys.create(
          //   {customer: customer.id},
          //   {apiVersion: '2022-08-01'}
          // );
          // const setupIntent = await stripe.setupIntents.create({
          //   customer: customer.id,
          // })

          customer = await StripeService.addNewCustomer(email)

        
            const ephemeralKey = await stripe.ephemeralKeys.create(
              {customer: customer.id},
              {apiVersion: '2022-08-01'}
            );
             const setupIntent = await stripe.setupIntents.create({
            customer: customer.id,
          })
        
                ///////////// CHECK OUT//////////////

               const subscriptionToPriceMap = {
                Monthly: process.env.MONTHLY_SUBSCRIPTION,
                Yearly: process.env.YEARLY_SUBSCRIPTION,
                Lifetime: process.env.LIFETIME_SUBSCRIPTION

              }
              
                const price = subscriptionToPriceMap[plan]

                console.log(customer.id, plan)

                console.log("price", price)
              
                try {
                  const session = await StripeService.createCheckoutSession(customer.id, price)
              console.log("session", session.id)
                  const ms =
                  new Date().getTime() + 1000 * 60 * 60 * 24 * process.env.TRIAL_DAYS
                  const n = new Date(ms)
              
                  user.plan = plan
                  user.hasTrial = true
                  user.endDate = n
                  user.save()
              
                } catch (e) {
                  console.log("Warning",e)
                  
                         handleResError(res, 30, "Internal Server Error");          
                         return
                }

                //////////////////////////////

                                
                          data = {
                            customerId: customer.id,
                            plan: 'none',
                            endDate: null
                          }
                          
                            user =  await User.findOneAndUpdate({ _id: userId }, { $set: data})

                            const isTrialExpired =
                            user.plan != 'none' && user.endDate < new Date().getTime()
                    
                            if (isTrialExpired) {
                              console.log('trial expired')
                              user.hasTrial = false
                              user.save()
                            } else {
                              console.log(
                                'no trial information',
                                user.hasTrial,
                                user.plan != 'none',
                                user.endDate < new Date().getTime()
                              )
                            }



                      customer = await StripeService.getCustomerByID(user.customerId)
                      message = {
                        data: {
                          customer: customer,
                          setupIntent: setupIntent.client_secret,
                          ephemeralKey: ephemeralKey.secret,
                          customerId: customer.id,
                          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY    
                        },
                      };
                      handleResSuccess(res,  res.statusCode, "Customer created successfullly", message);
     
        } catch (e) {
          console.log(e)
          err = {
            message: `Error: ${e}`,
          };
             handleResError(res, 30, "Internal Server Error");          
             return
        }
      } else {
       
           handleResError(res, 30, "Customer does not exist");          
           return
       
      }
    


 } catch (error) {
   err = {
     message: `Error: ${error}`,
   };
      handleResError(res, 30, err);
 }
}

module.exports = { 
  retrieveAllUsers,
  retrieveUser,
  createUserGoals,
  getUserGoals,
  getUserRecommendation,
  oneTimePayment,
  subscriptionPayment, 
  webhook
}