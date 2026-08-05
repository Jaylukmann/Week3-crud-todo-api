//Validation middleware

//import joi for validation
const Joi = require('joi');


//use joi to validate the request body
const validateCreateTodo = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(200).required(),
    completed: Joi.boolean().required(false)
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


module.exports = validateCreateTodo;