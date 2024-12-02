const db = require('../db/index')
//导入moment模块为进入库提供格式化时间
const moment = require('moment')
//日期格式化
const dateFormat = (data) => {
  let date = new Date(data)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month >= 10 ? month : '0' + month
  let day = date.getDate()
  day = day >= 10 ? day : '0' + day
  let hour = date.getHours()
  hour = hour >= 10 ? hour : '0' + hour
  let min = date.getMinutes()
  min = min >= 10 ? min : '0' + min
  let sec = date.getSeconds()
  sec = sec >= 10 ? sec : '0' + sec
  let formatedDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`
  return formatedDate
}
//展示所有订单（分页）
exports.allorder = (req, res) => {
  const sql = 'select * from orders'
  const perPage = 10
  const page = req.query.page || 1
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    let jieguo = results.reverse().slice(startIndex, endIndex)
    jieguo.forEach((item) => {
      if (item.status == 0) {
        item.status = '处理完成'
      } else if (item.status == 1) {
        item.status = '待处理'
      } else {
        item.status = '处理失败'
      }
      item.time = dateFormat(item.time)
    })
    res.send({
      status: 0,
      msg: '成功',
      data: jieguo,
      length: results.length,
      page: page,
    })
  })
}
//添加新的订单
exports.addorder = (req, res) => {
  const sql2 = 'insert into orders set ?'
  db.query(
    sql2,
    {
      name: req.body.name,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      address: req.body.address,
      tel: req.body.tel,
      msg: req.body.msg,
      goodname: req.body.goodname,
      num: req.body.num,
      status: 1, //0处理成功，1未处理，2处理失败
    },
    (err, results) => {
      if (err) {
        return res.send({
          status: 1,
          msg: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          msg: '发布新任务失败',
        })
      }
      res.send({
        status: 0,
        msg: '发布新任务成功',
      })
    }
  )
}
//展示未处理订单
exports.ordernot = (req, res) => {
  const sql3 = 'select * from orders where status=1'
  const perPage = 10
  const page = req.query.page || 1
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  db.query(sql3, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    const jieguo = results.reverse().slice(startIndex, endIndex)
    jieguo.forEach((item) => {
      if (item.status == 0) {
        item.status = '处理完成'
      } else if (item.status == 1) {
        item.status = '待处理'
      } else {
        item.status = '处理失败'
      }
      item.time = dateFormat(item.time)
    })
    res.send({
      status: 0,
      page: page,
      length: results.length,
      msg: '查询成功',
      data: jieguo,
    })
  })
}
//更改订单状态
exports.changestatus = (req, res) => {
  const sql4 = 'update orders set ? where id=?'
  db.query(
    sql4,
    [
      { status: req.body.status, msg: req.body.msg, operastaff: req.user.name },
      req.body.id,
    ],
    (err, results) => {
      if (err) {
        return res.send({
          status: 1,
          msg: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          msg: '处理失败',
        })
      }
      res.send({
        status: 0,
        msg: '处理成功',
      })
    }
  )
}
