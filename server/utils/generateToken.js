const jwt = require('jsonwebtoken');

const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? process.env.JWT_EXPIRE_LONG : process.env.JWT_EXPIRE
  });
};

module.exports = generateToken;