const joi = require('joi')
const id = joi.number().min(0).required()
exports.del_goods_schema = {
  body: {
    id,
  },
}
