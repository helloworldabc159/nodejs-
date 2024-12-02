const db = require('../db/index')
//展示商品类型的接口,带分页功能
exports.typeshow = (req, res) => {
  const sql1 = 'select * from goodstype'
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
    } else {
      return res.send({
        status: 0,
        data: results.slice(startIndex, endIndex),
        msg: '查询成功',
        length: results.length,
      })
    }
  })
}
exports.typesearch = (req, res) => {
  const sql2 = 'select * from goodstype where type=?'
  db.query(sql2, req.query.type, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    } else if (results.length == 0) {
      res.send({ status: 1, msg: '无此库存种类，查询失败' })
    } else {
      return res.send({
        status: 0,
        msg: '查询成功',
        data: results,
      })
    }
  })
}
exports.typedel = (req, res) => {
  const sql6 = 'select * from goods where type=?'
  db.query(sql6, req.query.id, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results.length > 0) {
      return res.send({
        status: 1,
        msg: '仍有该类型的货物存于仓库，无法删除',
      })
    } else {
      const sql3 = 'delete from goodstype where id=?'
      db.query(sql3, req.query.id, (err, results) => {
        if (err) {
          return res.send({
            status: 1,
            msg: err.message,
          })
        }
        if (results.affectedRows !== 1) {
          return res.send({
            status: 1,
            message: '删除失败',
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
exports.addtype = (req, res) => {
  const typeinfo = req.body
  const sql4 = 'select * from goodstype where type=?'
  db.query(sql4, typeinfo.type, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results[0] !== undefined) {
      if (results[0].type === req.body.type) {
        return res.send({
          status: 1,
          msg: '此类别已存在于库中，无需再添加',
        })
      }
    }
    const sql5 = 'insert into goodstype set ?'
    db.query(sql5, { type: typeinfo.type }, (err, results) => {
      if (err) {
        res.send({
          status: 1,
          msg: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        res.send({
          status: 1,
          msg: '添加类别失败',
        })
      }
      res.send({
        status: 0,
        msg: '添加类别成功',
      })
    })
  })
}
