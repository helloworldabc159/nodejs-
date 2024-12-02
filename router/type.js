const express = require('express')
const Router = express.Router()
const expressJoi = require('@escook/express-joi')
//获取库存类型信息
const { typeshow } = require('../router_handler/type')
Router.get('/type/showall', typeshow)
//查询类型信息
const { typesearch } = require('../router_handler/type')
Router.get('/type/search', typesearch)
//删除类型信息
const { typedel } = require('../router_handler/type')
Router.get('/type/deltype', typedel)
//增加库存类型信息
//增加库存的类目
const { addtype } = require('../router_handler/type')
const { add_type_schema } = require('../schema/typeadd')
Router.post('/type/addtype', expressJoi(add_type_schema), addtype)
module.exports = Router
