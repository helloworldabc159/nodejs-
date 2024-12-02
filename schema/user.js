//这是注册的验证规则
//导入定义验证规则的包
const joi = require('joi')
//定义用户名和密码的验证规则
const name = joi.string().min(1).max(15).required()
const position = joi.number().required().integer()
const age = joi.number().required().integer()
const email = joi.string()
const tel = joi.string().required()
const gender = joi.number().required()
//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    name,
    position,
    age,
    email,
    tel,
    gender,
  },
}
