const joi = require('joi')
const house = joi.number().required()
const area = joi.number().required()
const box = joi.number().required()
exports.insert_house_schema = {
  body: {
    house,
    area,
    box,
  },
}
