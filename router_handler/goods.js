//导入数据库操作模块
const { number, date } = require('joi')
const db = require('../db/index')
//导入moment模块为进入库提供格式化时间
const moment = require('moment')
//商品查询模块
exports.goodsdetail = (req, res) => {
  // console.log(req.body.id)
  const sql1 = 'select * from goods where goodname=?'
  db.query(sql1, req.query.goodname, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results.length !== 1) {
      return res.send({
        status: 1,
        msg: '查询产品信息失败',
      })
    }
    res.send({
      status: 0,
      msg: '查询产品信息成功',
      result: results[0],
    })
  })
  // res.send('ok')
}
//商品添加模块
exports.addgoods = (req, res) => {
  const sql100 = 'select * from warehouse where house=? and area=? and box=?'
  db.query(
    sql100,
    [req.body.house, req.body.area, req.body.box],
    (err, results) => {
      if (err) {
        return res.send({ status: 1, msg: err.message })
      } else {
        if (results.length == 0) {
          return res.send({
            status: 1,
            msg: '此存放地址不存在',
          })
        } else {
          //在此进行添加操作
          const goodinfo = req.body
          goodinfo.number = 0
          const sql2 = 'select * from goodstype where id=?'
          db.query(sql2, goodinfo.type, (err, results) => {
            if (err) {
              return res.send({
                status: 1,
                msg: err.message,
              })
            }
            if (results.length !== 1) {
              return res.send({
                status: 1,
                msg: '此商品种类未定义',
              })
            }
            //TODO：根据产品名字看是否已经这个产品已经被添加
            const sql4 = 'select * from goods where goodname=?'
            db.query(sql4, goodinfo.goodname, (err, results) => {
              if (err) {
                return res.send({
                  status: 1,
                  msg: err.message,
                })
              }
              // console.log(results[0])
              if (results[0] !== undefined) {
                if (results[0].goodname === req.body.goodname) {
                  return res.send({
                    status: 1,
                    msg: '此商品已存入',
                  })
                }
              }

              //TODO:增加新库存信息
              const sql3 = 'insert into goods set ?'
              db.query(
                sql3,
                {
                  goodname: goodinfo.goodname,
                  type: goodinfo.type,
                  weight: goodinfo.weight,
                  price: goodinfo.price,
                  number: goodinfo.number,
                  place: `${req.body.house}-${req.body.area}-${req.body.box}`,
                },
                (err, results) => {
                  if (err) {
                    return res.send({
                      status: 1,
                      message: err.message,
                    })
                  }
                  if (results.affectedRows !== 1) {
                    return res.send({
                      status: 1,
                      message: '添加新商品失败,请稍候再试',
                    })
                  }
                  res.send({
                    status: 0,
                    msg: '添加成功',
                  })
                }
              )
            })
          })
        }
      }
    }
  )
}
//类别查询模块
exports.searchtype = (req, res) => {
  const sql17 = 'select * from goodstype'
  db.query(sql17, (err, results) => {
    if (err) {
      res.send({
        status: 1,
        msg: err.message,
      })
    } else {
      res.send({
        status: 0,
        msg: '查询成功',
        data: results,
      })
    }
  })
}
//增加库存模块
exports.addgoodsnum = (req, res) => {
  // res.send('ok')
  //根据名字查询看看被增加的商品是否存入数据库中
  const sql7 = 'select * from goods where id=?'
  db.query(sql7, req.body.id, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results.length !== 1) {
      return res.send({
        status: 1,
        msg: '库中并无此库存信息',
      })
    }
    //进行增加库存数量操作
    const goodsnum = results[0].number
    const addnumber = Number(req.body.number)
    let result = goodsnum + addnumber
    const sql8 = 'update goods set number=? where id=?'
    db.query(sql8, [result, req.body.id], (err, results) => {
      if (err) {
        res.send({
          status: 1,
          msg: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        res.send({
          status: 1,
          msg: '增加库存失败',
        })
      }
      //增加出入库记录
      const sql12 = 'insert into record set ?'
      db.query(
        sql12,
        {
          operaid: req.user.id,
          goodname: req.body.goodname,
          inorout: 1,
          num: addnumber,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        (err, results1) => {
          if (err) {
            return res.send({
              status: 1,
              msg: err.message,
            })
          }
          if (results1.affectedRows !== 1) {
            return res.send({
              status: 1,
              msg: '出入库资料写入失败',
            })
          }
          res.send({
            status: 0,
            msg: '增加库存成功',
          })
        }
      )
    })
  })
}
//减少库存模块
exports.subgoodsnum = (req, res) => {
  const sql7 = 'select * from goods where id=?'
  db.query(sql7, req.body.id, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results.length !== 1) {
      return res.send({
        status: 1,
        msg: '库中并无此库存信息',
      })
    }
    //进行增加库存减少操作
    const goodsnum = results[0].number
    const subnumber = Number(req.body.number)
    if (subnumber > goodsnum) {
      return res.send({
        status: 1,
        msg: '期望减少的库存数大于库存数',
      })
    }
    let result = goodsnum - subnumber
    const sql8 = 'update goods set number=? where goodname=?'
    db.query(sql8, [result, req.body.goodname], (err, results) => {
      if (err) {
        res.send({
          status: 1,
          msg: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        res.send({
          status: 1,
          msg: '减少库存失败',
        })
      }
      //向出入库记录表中写入数据
      const sql13 = 'insert into record set ?'
      db.query(
        sql13,
        {
          operaid: req.user.id,
          goodname: req.body.goodname,
          inorout: 0,
          num: subnumber,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        (err, results2) => {
          if (err) {
            return res.send({
              status: 1,
              msg: err.message,
            })
          }
          if (results2.affectedRows !== 1) {
            return res.send({
              status: 1,
              msg: '出入库资料写入失败',
            })
          }
          res.send({
            status: 0,
            msg: '减少库存成功',
          })
        }
      )
    })
  })
}
//修改商品信息
exports.changeinfo = (req, res) => {
  const sql101 = 'select * from warehouse where house=? and area=? and box=?'
  db.query(
    sql101,
    [req.body.house, req.body.area, req.body.box],
    (err, results) => {
      if (err) {
        return res.send({
          status: 1,
          msg: err.message,
        })
      } else {
        if (results.length == 1) {
          const sql9 = 'update goods set ? where id=?'
          db.query(
            sql9,
            [
              {
                goodname: req.body.goodname,
                type: req.body.type,
                weight: req.body.weight,
                price: req.body.price,
                place: `${req.body.house}-${req.body.area}-${req.body.box}`,
              },
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
                  msg: '修改信息失败',
                })
              }
              res.send({
                status: 0,
                msg: '修改信息成功',
              })
            }
          )
        } else {
          return res.send({
            status: 1,
            msg: '此存放地址不存在',
          })
        }
      }
    }
  )

  //以上是修改的代码，下面不是
  // const sql9 = 'select * from goods where id=?'
  // db.query(sql9, req.body.id, (err, results) => {
  //   if (err) {
  //     return res.send({
  //       status: 1,
  //       msg: err.message,
  //     })
  //   }
  //   if (results.length !== 1) {
  //     return res.send({
  //       status: 1,
  //       msg: '并无此库存信息',
  //     })
  //   }
  //   //改变库存的信息
  //   //查询是否有这个类别
  //   const sql10 = 'select * from goods where goodname=?'
  //   db.query(sql10, req.body.goodname, (err, results) => {
  //     if (err) {
  //       return res.send({
  //         status: 1,
  //         msg: err.message,
  //       })
  //     }
  //     if (results.length !== 1) {
  //       return res.send({
  //         status: 1,
  //         msg: '此商品种类未定义',
  //       })
  //     }

  //     //进行修改工作
  //     const sql11 = 'update goods set ? where id=?'

  //   })
  // })
  // res.send('ok')
}
//查询所有库存信息(展示在首页的数据)
exports.allgoodsit = (req, res) => {
  const sql14 = 'select goodname,weight,price,number from goods'
  db.query(sql14, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    res.send({
      status: 0,
      msg: results,
    })
  })
}
//提供给echarts的数据
exports.echartsdata = (req, res) => {
  const sql15 = 'select goodname,number from goods'
  db.query(sql15, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    let num = 0
    results.map((item) => {
      num += item.number
    })
    res.send({
      status: 0,
      list: results.slice(0, 6),
      list2: results.slice(7, 13),
      list3: results.slice(14, 20),
      length: results.length,
      all: num,
    })
  })
}
//查询所有商品for goods(分页功能)
exports.allgood = (req, res) => {
  const sql16 = 'select * from goods'
  const perPage = 10
  const page = req.query.page || 1
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  db.query(sql16, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    const jieguo = results.slice(startIndex, endIndex)
    res.send({
      status: 0,
      page: page,
      length: results.length,
      msg: jieguo,
    })
  })
}
//删除库存的api
exports.delgood = (req, res) => {
  console.log(req.body)
  const sql18 = 'delete from goods where id=?'
  db.query(sql18, req.body.id, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    } else {
      return res.send({
        status: 0,
        msg: '删除成功',
      })
    }
  })
}
//出入库记录的api
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
//显示记录的api,带分页功能
exports.record = (req, res) => {
  const sql19 = 'select * from record'
  const perPage1 = 10
  const page1 = req.query.page || 1
  const startIndex1 = (page1 - 1) * perPage1
  const endIndex1 = startIndex1 + perPage1
  db.query(sql19, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    const jieguo1 = results
      .reverse()
      .map((obj) => {
        return {
          ...obj,
          inorout: obj.inorout == 1 ? '出库' : '入库',
          date: dateFormat(obj.date),
        }
      })
      .slice(startIndex1, endIndex1)
    // let test = results.map((obj) => {
    //   return {
    //     ...obj,
    //     inorout: obj.inorout == 1 ? '出库' : '入库',
    //   }
    // })
    // console.log(test)
    res.send({
      status: 0,
      page: page1,
      length: results.length,
      data: jieguo1,
    })
  })
}
//查询记录的api
exports.searchRecord = (req, res) => {
  console.log(req.query)
  const sql20 = 'select * from record where date like ?'
  const perpage2 = 10
  const page2 = req.query.page || 1
  const startIndex2 = (page2 - 1) * perpage2
  const endIndex2 = startIndex2 + perpage2
  db.query(sql20, req.query.date + '%', (err, results) => {
    if (err) {
      res.send({
        status: 1,
        msg: err.message,
      })
    } else {
      const result3 = results
        .reverse()
        .map((obj) => {
          return {
            ...obj,
            inorout: obj.inorout == 1 ? '出库' : '入库',
            date: dateFormat(obj.date),
          }
        })
        .slice(startIndex2, endIndex2)
      res.send({
        status: 0,
        msg: '查询成功',
        length: results.length,
        data: result3,
      })
    }
  })
}
