const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const port = 9000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/web', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

const bookSchema = new mongoose.Schema({
  type: String,
  name: String,
  content: String,
});

const Book = mongoose.model('Book', bookSchema, 'book');

app.get('/', async function (req, res) {
  try {
    const results = await Book.find({});
    res.send(results);
    console.log(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
