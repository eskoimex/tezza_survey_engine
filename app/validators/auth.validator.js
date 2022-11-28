const Joi = require('joi');


const SignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password:Joi.string().regex(/^[a-zA-Z0-9]{6,15}$/).required(),
});

const validateSignInData = async (data) => {
  let { error, value } = await SignInSchema.validate(data);
  return { err: error, value };
};



module.exports = { validateSignInData }