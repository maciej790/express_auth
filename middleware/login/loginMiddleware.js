const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret'; // Upewnij się, że to jest ten sam klucz, który używasz przy generowaniu tokenów

const loginMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Token po słowie "Bearer"
    
    // Weryfikacja tokena
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send('Nieprawidłowy token!');
      }

      req.user = user; // Przechowywanie danych użytkownika w req.user
      next();
    });
  } else {
    res.status(401).send('Brak tokena!');
  }
};

module.exports = loginMiddleware;
