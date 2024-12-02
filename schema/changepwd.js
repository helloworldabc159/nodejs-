//导入定义验证规则的包
const joi = require('joi')
const password = joi.string().min(6).max(20).required()
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}
