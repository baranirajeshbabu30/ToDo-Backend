const jwt = require('jsonwebtoken');


const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'mysecretkey';
  return jwt.sign({ userId: user.userId }, secret, { expiresIn: '1h' });
};


module.exports = generateToken;
