const joi = require('joi')
const goodname = joi.string().min(1).required()
const type = joi.number().integer().min(1).required()
const price = joi.number().min(0).required()
const weight = joi.number().min(0).required()
const house = joi.number().required()
const area = joi.number().required()
const box = joi.number().required()
const id = joi.number().required()
exports.change_goodinfo_schema = {
  body: {
    goodname,
    type,
    price,
    weight,
    id,
    area,
    house,
    box,
  },
}
