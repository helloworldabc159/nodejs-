const joi = require('joi')
const title = joi.string().required()
const content = joi.string().required()
exports.insert_msg_schema = {
  body: {
    title,
    content,
  },
}
