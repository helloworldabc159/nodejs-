const { query } = require('express')
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
//展示信息
exports.showmsg = (req, res) => {
  const sql = 'select id,author,title,time from msg'
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    results.forEach((item) => {
      item.time = dateFormat(item.time)
    })
    if (results.length > 10) {
      return res.send({
        status: 0,
        msg: '查询成功',
        data: results.reverse().slice(0, 10),
        length: results.length,
      })
    } else {
      return res.send({
        status: 0,
        msg: '查询成功',
        data: results.reverse(),
        length: results.length,
      })
    }
  })
}
//展示信息(分页功能)
exports.showmsgPage = (req, res) => {
  const sql1 = 'select id,author,title,time from msg'
  const perPage = 10
  const page = req.query.page || 1
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  db.query(sql1, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    const jieguo = results.reverse().slice(startIndex, endIndex)
    jieguo.forEach((item) => {
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
//插入信息
exports.addmsg = (req, res) => {
  const sql2 = 'insert into msg set ?'
  db.query(
    sql2,
    {
      author: req.user.name,
      title: req.body.title,
      content: req.body.content,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
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
          msg: '发布失败',
        })
      }
      res.send({
        status: 0,
        msg: '发布成功',
      })
    }
  )
}
//查看信息
exports.readmsg = (req, res) => {
  const sql3 = 'select author,title,content,time from msg where id=?'
  db.query(sql3, req.query.id, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    } else if (results.length !== 1) {
      return res.send({
        status: 1,
        msg: '加载数据失败',
      })
    } else {
      results.forEach((item) => {
        item.time = dateFormat(item.time)
      })
      res.send({
        status: 0,
        msg: '查询成功',
        data: results,
      })
    }
  })
}
