const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./connectDatabase');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM customer WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }

    const user = rows[0];

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.send({ message: 'Login success', token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;