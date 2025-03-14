const db = require('../../db');

const checkIfUserExists = (req, res, next) =>{
    const {login} = req.body;
    db.query('SELECT * FROM users WHERE login = ?', [login], (err, result) =>{
        if (err) return res.json("Błąd serwera!");
        if(result.length != 0) return res.json("Taki login już istnieje w bazie!");
        next()
    })
}

module.exports = checkIfUserExists;