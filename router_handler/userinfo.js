//导入数据库操作模块
const db = require('../db/index')
//导入bcryptjs，用于对比加密的密码
const bcrypt = require('bcryptjs')
//用于个人中心信息查询的函数
exports.getUserInfo = (req, res) => {
  const sql =
    'select id,name,age,email,position,tel,gender from user where id=?'
  //express-jwt会自动在req中挂载user，req.user中存着用户的token信息(解析token的信息)
  // console.log(req.user)
  db.query(sql, req.user.id, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results.length !== 1) {
      return res.send({
        status: 1,
        msg: '获取用户信息失败',
      })
    }
    results[0].position = results[0].position == 1 ? '管理人员' : '普通职工'
    results[0].gender = results[0].gender == 1 ? '男' : '女'
    return res.send({
      status: 0,
      msg: '获取用户信息成功',
      result: results[0],
    })
  })
  // res.send('ok')
}
//更新用户信息的函数
exports.updateUserInfo = (req, res) => {
  // res.send('ok123')
  const updateinfo = req.body
  const sql1 = 'update user set ? where id=?'
  db.query(sql1, [updateinfo, req.user.id], (err, results) => {
    if (err) {
      res.send({
        status: 1,
        msg: err.message,
      })
    } else {
      res.send({
        status: 0,
        msg: '更新用户信息成功！',
      })
    }
  })
}
//更改用户密码的函数
exports.updateUserPassword = (req, res) => {
  // res.send('ok')
  const sql2 = 'select * from user where id=?'
  db.query(sql2, req.user.id, (err, results) => {
    if (err) {
      res.send({
        status: 1,
        msg: err.message,
      })
    }
    if (results.length !== 1) {
      return res.send({
        status: 1,
        msg: '用户不存在',
      })
    }
    //TODO：判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    )
    if (!compareResult) {
      return res.send({
        status: 1,
        msg: '原密码错误',
      })
    }
    //更改新密码
    const sql3 = 'update user password set password=? where id=?'
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(sql3, [newPwd, req.user.id], (err, results) => {
      if (err) {
        return res.send({
          status: 1,
          msg: err.message,
        })
      }
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '更新密码失败',
        })
      }
      res.send({
        status: 0,
        message: '更新密码成功',
      })
    })
    // res.send('ok')
  })
}
//展示用户的信息
exports.userInfo = (req, res) => {
  const sql4 = 'select id,name,age,email,position,tel,gender from user'
  db.query(sql4, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    results.forEach((item) => {
      item.position = item.position == 0 ? '普通职工' : '管理人员'
      item.gender = item.gender == 1 ? '男' : '女'
    })
    res.send({
      status: 0,
      msg: '查询成功',
      data: results.length >= 10 ? results.slice(0, 10) : results,
      length: results.length,
    })
  })
}
//查询用户信息
exports.usersearch = (req, res) => {
  const sql5 =
    'select id,name,age,email,position,tel,gender from user where name=?'
  db.query(sql5, req.query.name, (err, results) => {
    if (err) {
      return res.send({ status: 1, msg: err.message })
    } else if (results.length !== 1) {
      return res.send({ status: 1, msg: '并无此员工' })
    } else {
      results.forEach((item) => {
        item.position = item.position == 0 ? '普通职工' : '管理人员'
        item.gender = item.gender == 1 ? '男' : '女'
      })
      return res.send({
        status: 0,
        msg: '查询成功',
        data: results,
      })
    }
  })
}
//用户信息分页功能
exports.userPage = (req, res) => {
  const sql6 = 'select id,name,age,email,position,tel,gender from user'
  const perPage = 10
  const page = req.query.page || 1
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  db.query(sql6, (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message,
      })
    }
    let jieguo = results.slice(startIndex, endIndex)
    jieguo.forEach((item) => {
      // item.gender = item.gender == 1 ? '男性' : '女性'
      if (item.gender == 1) {
        item.gender = '男'
      } else {
        item.gender = '女'
      }
      if (item.position == 1) {
        item.position = '管理人员'
      } else {
        item.position = '普通职工'
      }
    })

    res.send({
      status: 0,
      page: page,
      length: results.length,
      data: jieguo,
      msg: '成功',
    })
  })
}
//删除用户
exports.delUser = (req, res) => {
  const sql7 = 'delete from user where id=?'
  db.query(sql7, req.query.id, (err, result) => {
    if (err) {
      return { status: 1, msg: err.message }
    }
    if (result.affectedRows !== 1) {
      return { status: 1, msg: '删除失败' }
    }
    res.send({
      status: 0,
      msg: '删除成功',
    })
  })
}
//重设密码
exports.resetpwd = (req, res) => {
  const sql8 = 'update user set password=? where id=?'
  const resetpassword = bcrypt.hashSync('123456', 10)
  db.query(sql8, [resetpassword, req.body.id], (err, results) => {
    if (err) {
      return res.send({ status: 1, msg: err.message })
    }
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '重设密码失败',
      })
    }
    res.send({
      status: 0,
      message: '重设密码成功',
    })
  })
}
exports.changeposition = (req, res) => {
  const sql9 = 'update user set position=? where id =?'
  db.query(sql9, [req.body.position, req.body.id], (err, results) => {
    if (err) {
      return res.send({ status: 1, msg: err.message })
    }
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '职位变更失败',
      })
    }
    res.send({
      status: 0,
      message: '职位变更成功',
    })
  })
}
