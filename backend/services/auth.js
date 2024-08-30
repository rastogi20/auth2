const JWT = require("jsonwebtoken");
const User = require('../models/user');


const secret = "$uperMan@123";



const createToken = (user) => {
  return JWT.sign({ id: user._id, username: user.username }, secret, { expiresIn: '1h' });
};

const validateToken = (token) => {
  return JWT.verify(token, secret);
};

module.exports = { createToken, validateToken };


