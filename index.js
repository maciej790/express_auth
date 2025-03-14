const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('./db');
const checkIfUserExists = require('./middleware/register/checkIfUserExists');
const loginMiddleware = require('./middleware/login/loginMiddleware');
const bodyParser = require("body-parser");
require("dotenv").config();
const JWT_SECRET = 'secret';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

app.post('/register', checkIfUserExists, async (req, res) =>{
  const {login, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (login, password) VALUES (?, ?)', [login, hashedPassword], (err, result) =>{
    if (err) return res.json('Błąd serwera!');
    res.json('Zarejestrowano pomyślnie!');
  })
})

app.post('/login', (req, res) =>{
  const {login, password} = req.body;
  db.query('SELECT * FROM users WHERE login = ?', [login], async (err, result) =>{
    if(result.length == 0) return res.json('Błędne dane logowania!');
    const isPasswordsTheSame = await bcrypt.compare(password, result[0].password);
    if(!isPasswordsTheSame) return res.json('Błęden dane logowania');
    const token = jwt.sign(result[0], JWT_SECRET, {expiresIn: '1h'})
    res.json(token);
  })
})

app.get('/dashboard', loginMiddleware, (req, res) =>{
  res.json('Ściśle tajne dane!!!');
})

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});