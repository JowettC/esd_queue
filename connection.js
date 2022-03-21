var mysql = require('mysql');
require('dotenv').config();
var con = mysql.createConnection({
  host: "mysql+mysqlconnector://is213@host.docker.internal:3306/mydb_queue",
  user: "root",
  password: "",
  database: "mydb_queue"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;