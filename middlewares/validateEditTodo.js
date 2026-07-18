//use joi to validate patch

//import joi for validation
const Joi = require('joi');

//use joi to validate the request body
const validateEditTodo = (req, res, next) => {
  const schema = Joi.object({
    completed: Joi.boolean().required(false)
  });
  const { error } = schema.validate(req.body);
  if ( typeof req.body.completed !== 'boolean' || error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


module.exports = validateEditTodo;