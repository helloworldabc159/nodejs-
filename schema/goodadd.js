const joi = require('joi')
const goodname = joi.string().required()
const type = joi.number().min(1).required()
const weight = joi.number().required()
const price = joi.number().required()
const house = joi.number().required()
const area = joi.number().required()
const box = joi.number().required()
exports.add_goods_schema = {
  body: {
    goodname,
    type,
    weight,
    price,
    house,
    area,
    box,
  },
}
