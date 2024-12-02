//导入定义验证规则的包
const joi = require('joi')
//定义用户名和密码的验证规则
const name = joi.string().min(1).max(15).required()
const password = joi.string().min(6).max(12).required()
//定义验证注册和登录表单数据的规则对象
exports.login_schema = {
  body: {
    name,
    password,
  },
}
