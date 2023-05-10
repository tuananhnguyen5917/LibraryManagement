const express = require('express');
const router = express.Router();
const con = require('./connectDatabase');

router.get('/', function (req, res) {
    var sql = "SELECT title, name, link FROM book";
    con.query(sql, function(err, results) {
      if (err) throw err;
      res.send(results);
    });
});

router.get('/van', function (req, res) {
    var sql = "SELECT title, name, link FROM book WHERE title like '%Văn học%'";
    con.query(sql, function(err, results) {
      if (err) throw err;
      res.send(results);
    });
});

router.get('/trinhtham', function (req, res) {
    var sql = "SELECT title, name, link FROM book WHERE title like '%Trinh thám%'";
    con.query(sql, function(err, results) {
      if (err) throw err;
      res.send(results);
    });
});

router.get('/cart', function (req, res) {
  var sql = "SELECT title, name, link FROM book WHERE title like '%Trinh thám%'";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});

module.exports = router;