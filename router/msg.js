const express = require('express')
const Router = express.Router()
//导入数据验证模块
const expressJoi = require('@escook/express-joi')
//展示信息的接口
const { showmsg } = require('../router_handler/msg')
Router.get('/msg/showmsg', showmsg)
//分页功能
const { showmsgPage } = require('../router_handler/msg')
Router.get('/msg/pagemsg', showmsgPage)
//发布新消息
const { insert_msg_schema } = require('../schema/insertmsg')
const { addmsg } = require('../router_handler/msg')
Router.post('/msg/addmsg', expressJoi(insert_msg_schema), addmsg)
//查看信息
const { readmsg } = require('../router_handler/msg')
Router.get('/msg/readmsg', readmsg)
module.exports = Router
