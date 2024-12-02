const joi = require('joi')
const goodname = joi.any
exports.search_goods_schema = {
  body: {
    goodname,
  },
}
