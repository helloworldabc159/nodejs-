//导入express并创建服务器实例
const express = require('express')
const app = express()
const joi = require('joi')
//导入cors中间件并配置cors中间件
const cors = require('cors')
app.use(cors())
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//在路由之前封装res.cc函数
app.use((req, res, next) => {
  //status默认值为1，表示失败的情况
  //err的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

//要在路由之前配置解析token中间件
const expressJWT = require('express-jwt')
const config = require('../config')
app.use(
  expressJWT({ secret: config.jwtSecertKey }).unless({ path: [/^\/api/] })
)

//导入并使用用户路由模块
const userRouter = require('./router/user')
app.use(userRouter)
//导入并使用用户查询模块
const userinfoRouter = require('./router/userinfo')
app.use(userinfoRouter)
//导入并使用产品查询模块
const goodsRouter = require('./router/goods')
app.use(goodsRouter)
//导入并使用类别操作的中间件
const typeRouter = require('./router/type')
app.use(typeRouter)
//导入并使用信息中心的中间件
const msgRouter = require('./router/msg')
app.use(msgRouter)
//导入仓库信息的中间件
const wreRouter = require('./router/warehouse')
app.use(wreRouter)
//导入订单信息中间件
const orderRouter = require('./router/order')
app.use(orderRouter)
//定义错误级别的中间件
app.use((err, req, res, next) => {
  //验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  //身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //未知的错误
  // res.cc(err)
})

app.listen(80, () => {
  console.log('server running at http://127.0.0.1')
})
