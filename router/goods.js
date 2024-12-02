const express = require('express')
const Router = express.Router()
//导入数据验证模块
const expressJoi = require('@escook/express-joi')
const { search_goods_schema } = require('../schema/goodssearch')
const { add_goods_schema } = require('../schema/goodadd')
//获取库存信息的路由
const { goodsdetail } = require('../router_handler/goods')
Router.get('/good/search', expressJoi(search_goods_schema), goodsdetail)
//增加库存的路由
const { addgoods } = require('../router_handler/goods')
Router.post('/good/addgood', expressJoi(add_goods_schema), addgoods)
//增加库存的数量
const { addgoodsnum } = require('../router_handler/goods')
const { add_goodsnum_schema } = require('../schema/goodsaddnum')
Router.post('/good/addgoodsnum', expressJoi(add_goodsnum_schema), addgoodsnum)
//减少库存的数量
const { subgoodsnum } = require('../router_handler/goods')
Router.post('/good/subgoodsnum', expressJoi(add_goodsnum_schema), subgoodsnum)
//修改库存商品的信息
const { changeinfo } = require('../router_handler/goods')
const { change_goodinfo_schema } = require('../schema/changeinfo')
Router.post('/good/changeinfo', expressJoi(change_goodinfo_schema), changeinfo)
//查询所有库存信息(for home)
const { allgoodsit } = require('../router_handler/goods')
Router.get('/good/getallgoodit', allgoodsit)
//提供给echarts的数据
const { echartsdata } = require('../router_handler/goods')
Router.get('/good/forechart', echartsdata)
//为good页面提供数据
const { allgood } = require('../router_handler/goods')
Router.get('/good/allgood', allgood)
//查询所有种类
const { searchtype } = require('../router_handler/goods')
Router.get('/good/searchtype', searchtype)
//删除商品
const { delgood } = require('../router_handler/goods')
const { del_goods_schema } = require('../schema/delgood')
Router.post('/good/delgood', expressJoi(del_goods_schema), delgood)
//显示出入库记录
const { record } = require('../router_handler/goods')
Router.get('/good/record', record)
//根据日期查询出入库记录
const { searchRecord } = require('../router_handler/goods')
Router.get('/good/searchRec', searchRecord)
module.exports = Router
