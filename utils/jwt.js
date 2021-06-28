const jwt = require('jsonwebtoken');

// JSON WEB TOKEN
const createToken = (data) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: '5 days',
  });
  return token;
};

const verifyToken = (data) => {
  return jwt.verify(data, process.env.JWT_SECRET);
}

const decodeToken = (data) => jwt.decode(data)

const jsonwebtoken = {
  create: createToken,
  verify: verifyToken,
  decode: decodeToken
}

module.exports = jsonwebtoken

