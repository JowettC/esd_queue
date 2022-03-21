var mysql = require('mysql');

var con = mysql.createConnection({
  // host: "host.docker.internal",
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;