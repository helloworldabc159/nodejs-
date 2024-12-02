const express = require('express')
const router = express.Router()
//导入用户路由处理函数对应的模块
const userRouter = require('../router_handler/user')
//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')
const { login_schema } = require('../schema/login')
//注册新用户
router.post('/api/reguser', expressJoi(reg_login_schema), userRouter.regUser)
//登录
router.post('/api/login', expressJoi(login_schema), userRouter.login)
module.exports = router
