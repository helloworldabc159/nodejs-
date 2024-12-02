const express = require('express')
const Router = express.Router()
//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
const { update_user_schema } = require('../schema/updateuser')
const { update_password_schema } = require('../schema/changepwd')
//挂载路由
//获取用户基本信息的路由
const { getUserInfo } = require('../router_handler/userinfo')
Router.get('/my/userinfo', getUserInfo)
//更新用户信息的路由
const { updateUserInfo } = require('../router_handler/userinfo')
Router.post('/my/updinfo', expressJoi(update_user_schema), updateUserInfo)
//更改用户密码的路由
const { updateUserPassword } = require('../router_handler/userinfo')
Router.post(
  '/my/updatepwd',
  expressJoi(update_password_schema),
  updateUserPassword
)
//展示用户信息
const { userInfo } = require('../router_handler/userinfo')
Router.get('/user/showuser', userInfo)
//查询用户的信息
const { usersearch } = require('../router_handler/userinfo')
Router.get('/user/usersearch', usersearch)
//分页功能
const { userPage } = require('../router_handler/userinfo')
Router.get('/user/userpage', userPage)
//删除功能
const { delUser } = require('../router_handler/userinfo')
Router.get('/user/deluser', delUser)
//重设密码
const { resetpwd } = require('../router_handler/userinfo')
Router.post('/user/resetpwd', resetpwd)
//变更职位
const { changeposition } = require('../router_handler/userinfo')
Router.post('/user/chgpos', changeposition)
module.exports = Router
