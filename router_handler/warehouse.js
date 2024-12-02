//导入数据库操作模块
const { query } = require('express')
const db = require('../db/index')
//展现信息
exports.showdata = (req, res) => {
  const sql = 'select * from warehouse order by house,area,box desc'
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    } else {
      res.send({
        status: 0,
        msg: '查询成功',
        data: results.length >= 10 ? results.slice(0, 10) : results,
        length: results.length,
      })
    }
  })
}
//分页功能
exports.housepage = (req, res) => {
  const sql1 = 'select * from warehouse order by house,area,box desc'
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
    let jieguo = results.slice(startIndex, endIndex)
    res.send({
      status: 0,
      msg: '查询成功',
      data: jieguo,
      length: results.length,
    })
  })
}
//添加仓库功能
exports.addhouse = (req, res) => {
  const sql2 = 'select * from warehouse where house=? AND area=? AND box=?'
  db.query(
    sql2,
    [req.body.house, req.body.area, req.body.box],
    (err, results) => {
      if (err) {
        return res.send({ status: 1, msg: err.message })
      } else if (results.length == 1) {
        return res.send({
          status: 1,
          msg: '此货架已在记录，无需再添加',
        })
      } else {
        const sql3 = 'insert into warehouse set ? '
        db.query(
          sql3,
          { house: req.body.house, area: req.body.area, box: req.body.box },
          (err, results) => {
            if (err) {
              return res.send({
                status: 1,
                msg: err.message,
              })
            } else if (results.affectedRows !== 1) {
              return res.send({ status: 1, msg: '添加失败' })
            } else {
              res.send({
                status: 0,
                msg: '添加成功',
              })
            }
          }
        )
      }
    }
  )
}
//删除仓库功能
exports.delhouse = (req, res) => {
  let warestr = `${req.body.house}-${req.body.area}-${req.body.box}`
  const sql6 = 'select * from goods where place=?'
  db.query(sql6, warestr, (err, rsu) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (rsu.length > 0) {
      return res.send({
        status: 1,
        msg: '此货架上还有货物，该货架无法删除',
      })
    } else {
      const sql4 = 'delete from warehouse where id=?'
      db.query(sql4, req.body.id, (err, results) => {
        if (err) {
          return res.send({
            status: 1,
            msg: err.message,
          })
        }
        if (results.affectedRows !== 1) {
          return res.send({
            status: 1,
            msg: '删除失败',
          })
        }
        res.send({
          status: 0,
          msg: '删除成功',
        })
      })
    }
  })
}
//查询货架功能
exports.searchhouse = (req, res) => {
  const sql5 = 'select * from warehouse where house=? and area=? and box=?'
  db.query(
    sql5,
    [req.body.house, req.body.area, req.body.box],
    (err, results) => {
      if (err) {
        res.send({ status: 1, msg: err.message })
      } else {
        if (results.length == 0) {
          res.send({
            status: 0,
            data: 0,
          })
        } else {
          res.send({
            status: 0,
            data: 1, //0代表货架不存在，1则存在
          })
        }
      }
    }
  )
}
