const joi = require('joi')
const type = joi.string().min(1).required()
exports.add_type_schema = {
  body: {
    type,
  },
}
