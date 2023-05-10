const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "newuser",
    password: "password",
    database: "web"
});

con.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
});

module.exports = con;