// helpers/auth.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch (err) {
    return false;
  }
};

const verifyToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = { isAuthenticated, verifyToken };
