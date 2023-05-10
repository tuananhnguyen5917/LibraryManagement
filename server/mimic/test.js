const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');

// Kết nối đến cơ sở dữ liệu MySQL
const con = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  password: 'password',
  database: 'web',
});

// Đọc từng dòng trong tệp văn bản và đưa chúng vào cơ sở dữ liệu MySQL
const file = readline.createInterface({
  input: fs.createReadStream('link.txt'),
});

const values = [];

file.on('line', (line) => {
  const [title, author, link] = line.split('\\');
  values.push([title, author, link]);
});

file.on('close', () => {
  // Chèn các giá trị vào bảng "book" trong cơ sở dữ liệu
  const sql = 'INSERT INTO book (title, name, link) VALUES ?';
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log(`Inserted ${result.affectedRows} rows`);
  });

  // Đóng kết nối đến cơ sở dữ liệu
  con.end();
});
