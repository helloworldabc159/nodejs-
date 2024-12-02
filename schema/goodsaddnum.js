const joi = require('joi')
const goodname = joi.string().min(1).required()
const number = joi.number().integer().min(0).required()
const id = joi.number().min(0).required()
exports.add_goodsnum_schema = {
  body: {
    number,
    id,
    goodname,
  },
}
