var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "newuser",
  password: "password",
  database: "web"
});

function getdatabase(query) {
    con.connect(function(err) {
        if(err) throw err;
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            var titles = [], names = [], links = [];
            result.forEach(function(row) {
                titles.push(row.title);
                names.push(row.name);
                links.push(row.link);
            });
            console.log('Titles:', titles);
            console.log('Names:', names);
            console.log('Links:', links);
        });
    });
}

getdatabase("SELECT title, name, link FROM book");



//export default getdatabase;