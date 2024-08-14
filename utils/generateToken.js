const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role, 
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return token;
};

module.exports = generateToken;
