const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');

const app = express();
const port = 9000;

const mysql = require('mysql');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get('/', function (req, res) {
  var sql = "SELECT title, name, link FROM book";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});

let username;
let password;

app.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  const userID = req.query.term;
  // Truy vấn cơ sở dữ liệu để tìm kiếm sản phẩm thỏa mãn điều kiện
  con.query(`SELECT book.* FROM book 
              WHERE (name LIKE '%${searchTerm}%' OR title LIKE '%${searchTerm}%')
              and book.book_id not in 
              (
                select rental.book_id
                  from rental
                  inner join customer on customer.customer_id = rental.customer_id
                  where email = '${username}'
                  and password = '${password}'
                  and rental.rental_date is not null
                  and rental.return_date is null
              )`, (error, results) => {
      if (error) {
          console.error('Error querying MySQL database:', error);
          return res.status(500).json({ error });
      }
      res.json(results);
  });
});

app.get('/cart', (req, res) => {
  const cart = req.query.term;
  // Truy vấn cơ sở dữ liệu để tìm kiếm sản phẩm thỏa mãn điều kiện
  con.query(`SELECT COUNT(rental.rental_id) as soluong, book.link, book.name, rental.book_id, rental.customer_id FROM rental 
              INNER JOIN book ON book.book_id = rental.book_id 
              WHERE customer_id = '${cart}'
              and rental.rental_date is not null
              and rental.return_date is null
              GROUP BY book.book_id`, (error, results) => {
      if (error) {
          console.error('Error querying MySQL database:', error);
          return res.status(500).json({ error });
      }
      res.json(results);
  });
});

app.get('/booked', (req, res) => {
  const cart = req.query.term;
  // Truy vấn cơ sở dữ liệu để tìm kiếm sản phẩm thỏa mãn điều kiện
  con.query(`SELECT * FROM rental 
              INNER JOIN book ON book.book_id = rental.book_id 
              WHERE customer_id = '${cart}'
              and rental.return_date is not null`, (error, results) => {
      if (error) {
          console.error('Error querying MySQL database:', error);
          return res.status(500).json({ error });
      }
      res.json(results);
  });
});

app.post('/update/rental', (req, res) => {
  const { book_id, userID } = req.body;

  const query = `INSERT INTO rental (book_id, customer_id) VALUES ('${book_id}', ${userID})`;

  con.query(query, (err, result) => {
      if (err) throw err;
      console.log(`Insert data ${book_id}, ${userID} done`);
      res.sendStatus(200);
  });
});

app.post('/update/return', (req, res) => {
  const { book_id, customer_id } = req.body;

  const query = `UPDATE rental 
                 SET return_date = now() 
                 WHERE book_id = '${book_id}' 
                   AND customer_id = '${customer_id}'`;

  con.query(query, (err, result) => {
      if (err) throw err;
      console.log(`UPDATE data ${book_id}, ${customer_id} done`);
      res.sendStatus(200);
  });
});

app.post('/api/login', async (req, res) => {
  username = req.body.username;
  password = req.body.password;
  //const { username: reqUsername, password: reqPassword } = req.body;

  // Kiểm tra tài khoản người dùng
  con.query('SELECT * FROM customer WHERE email = ?', [username], async (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
      return;
    }

    const user = results[0];

    // Kiểm tra mật khẩu người dùng
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password != user.password) {
      res.status(401).json({ message: user.password });
      return;
    }

    const customer_id = user.customer_id;

    // Trả về token cho người dùng
    res.status(200).json({ customer_id });
  });
});

app.get('/api/user', (req, res) => {
  // Truy vấn cơ sở dữ liệu để tìm kiếm sản phẩm thỏa mãn điều kiện
  con.query(`SELECT customer_id FROM customer WHERE email = '${username}' AND password = '${password}'`, (error, results) => {
      if (error) {
          console.error('Error querying MySQL database:', error);
          return res.status(500).json({ error });
      }
      res.json(results);
  });
});

app.get('/api/getUser', (req, res) => {
  con.query(`SELECT CONCAT(c.first_name, ' ', c.last_name) AS name,c.phone, c.address, c.age,
              GROUP_CONCAT(l.name SEPARATOR ', ') AS his
              FROM customer AS c
              LEFT JOIN lichsu AS l ON c.customer_id = l.customer_id
              WHERE c.email = '${username}' AND c.password = '${password}'
              GROUP BY c.customer_id`, (error, results) => {
      if (error) {
          console.error('Error querying MySQL database:', error);
          return res.status(500).json({ error });
      }
      res.json(results);
  });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});