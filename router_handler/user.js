//导入数据库操作模块
const db = require('../db/index')
//导入bcryptjs这个包，为密码加密
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
//导入全局的配置文件
const config = require('../../config')
//注册新用户的处理函数
exports.regUser = (req, res) => {
  const userinfo = req.body
  const sqlstr = 'select * from user where name=?'
  db.query(sqlstr, userinfo.name, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err.message })
    }
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '用户名已被占用，请更换其他用户名',
      })
    }
    //TODO:用户名可以使用
    //调用bcrypt.hashSync()对密码进行加密,初始密码都为123456
    const orginpwd = '123456'
    let password = bcrypt.hashSync(orginpwd, 10)
    // let userinfo = {
    //   name: userinfo.name,
    //   password: password,
    //   age: userinfo.age,
    //   position: userinfo.position,
    //   email: userinfo.email,
    //   tel: userinfo.tel,
    // }
    userinfo.password = password
    userinfo.gender = req.body.gender

    // 定义插入新用户的sql语句
    const insertsql = 'insert into user set ?'
    db.query(insertsql, userinfo, (err, results) => {
      if (err) {
        return res.send({
          status: 1,
          message: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '注册新用户失败,请稍候再试',
        })
      }
      res.send({
        status: 0,
        message: '注册成功',
      })
    })
  })
}
//登录的处理函数
exports.login = (req, res) => {
  const userinfo = req.body
  //定义sql语句
  const sql = 'select * from user where name=?'
  //执行查询
  db.query(sql, userinfo.name, (err, results) => {
    //执行SQL语句失败
    if (err)
      return res.send({
        status: 1,
        message: err.message,
      })
    if (results.length !== 1)
      return res.send({
        status: 1,
        message: '登录失败！',
      })
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    )
    if (!compareResult)
      return res.send({
        status: 1,
        msg: '登录失败',
      })
    // res.send({
    //   status: 0,
    //   msg: '登录成功',
    // })
    //TODO:在服务器端生成token字符串
    const user = { ...results[0], password: '' }
    //对用户的信息进行加密，生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecertKey, {
      expiresIn: config.expiresIn,
    })
    //调用res.send()将token响应给客户端
    if (user.position == 0) {
      res.send({
        status: 0,
        msg: '登录成功',
        token: 'Bearer ' + tokenStr,
        name: user.name,
        position: user.position,
        menu: [
          {
            path: '/',
            name: 'home',
            label: '首页',
            icon: 'video-play',
            url: 'Home/home',
          },
          {
            path: '/good',
            name: 'good',
            label: '库存管理',
            icon: 'TakeawayBox',
            url: 'Good/good',
          },
          {
            path: '/record',
            name: 'record',
            label: '出入库记录',
            icon: 'Monitor',
            url: 'Record/record',
          },
          {
            path: '/type',
            name: 'type',
            label: '库存种类',
            icon: 'Van',
            url: 'Type/type',
          },
          {
            path: '/msg',
            name: 'msg',
            label: '公告',
            icon: 'Comment',
            url: 'Message/message',
          },
          {
            path: '/warehouse',
            name: 'warehouse',
            label: '仓库管理',
            icon: 'HomeFilled',
            url: 'WareHouse/warehouse',
          },
          {
            path: '/allorder',
            name: 'allorder',
            label: '所有订单',
            icon: 'PieChart',
            url: 'Order/aaa',
          },
          {
            path: '/noneorder',
            name: 'noneorder',
            label: '未处理订单',
            icon: 'Grid',
            url: 'Order/none',
          },
        ],
      })
    } else if (user.position == 1) {
      res.send({
        status: 0,
        msg: '登录成功',
        token: 'Bearer ' + tokenStr,
        name: user.name,
        position: user.position,
        menu: [
          {
            path: '/',
            name: 'home',
            label: '首页',
            icon: 'video-play',
            url: 'Home/home',
          },
          {
            path: '/good',
            name: 'good',
            label: '库存管理',
            icon: 'TakeawayBox',
            url: 'Good/good',
          },
          {
            path: '/record',
            name: 'record',
            label: '出入库记录',
            icon: 'Monitor',
            url: 'Record/record',
          },
          {
            path: '/type',
            name: 'type',
            label: '库存种类',
            icon: 'Van',
            url: 'Type/type',
          },
          {
            path: '/msg',
            name: 'msg',
            label: '公告',
            icon: 'Comment',
            url: 'Message/message',
          },
          {
            path: '/warehouse',
            name: 'warehouse',
            label: '仓库管理',
            icon: 'HomeFilled',
            url: 'WareHouse/warehouse',
          },
          {
            path: '/allorder',
            name: 'allorder',
            label: '所有订单',
            icon: 'PieChart',
            url: 'Order/aaa',
          },
          {
            path: '/noneorder',
            name: 'noneorder',
            label: '未处理订单',
            icon: 'Grid',
            url: 'Order/none',
          },
          {
            path: '/usermange',
            name: 'usermange',
            label: '职工管理',
            icon: 'Management',
            url: 'UserManage/usermange',
          },
        ],
      })
    }
  })
}
