var mysql = require('mysql');

var con = mysql.createConnection({
  // for when deployed to dockers
  host: "host.docker.internal",
  // for local machine 
  // host: "127.0.0.1",
  user: "root",
  password: "",
  database: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;