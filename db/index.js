//配置并安装mysql
const mysql = require('mysql')
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test',
})
// db.connect((err) => {
//   console.log(err)
// })
module.exports = db
