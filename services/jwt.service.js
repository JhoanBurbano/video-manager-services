require('dotenv').config()
const jwt = require('jsonwebtoken');
const secretKey = process.env.NODE_SECRET_KEY;

const jwtService = {
  generateToken: (data, expiresIn = '1h') => {
    return jwt.sign(data, secretKey, { expiresIn });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      return null;
    }
  },

  decodeToken: (token) => {
    return jwt.decode(token);
  },
};

module.exports = jwtService;
