const express = require('express')
const Router = express.Router()
const expressJoi = require('@escook/express-joi')
//展示订单
const { allorder } = require('../router_handler/order')
Router.get('/order/getorder', allorder)
//添加新的订单
const { addorder } = require('../router_handler/order')
Router.post('/order/addorder', addorder)
//展示未处理订单
const { ordernot } = require('../router_handler/order')
Router.get('/order/ordernot', ordernot)
//更改订单状态
const { changestatus } = require('../router_handler/order')
Router.post('/order/changestatus', changestatus)
module.exports = Router
