const joi = require('joi')
const id = joi.number().min(1).integer().required()
const name = joi.string().min(1).required()
const position = joi.number().integer().min(0).required()
const age = joi.number().integer().min(1).required()
const email = joi.string().email()
const gender = joi.required()
const tel = joi.string().required()
exports.update_user_schema = {
  body: {
    age,
    email,
    gender,
    tel,
  },
}
