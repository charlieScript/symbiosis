const bcryptjs = require('bcrypt')


const hashData = async (data) => {
  const salt = bcryptjs.genSalt(10)
  const result = bcrypt.hash(data, salt)
  return result
}

const compareData = async (data, hash) => {
  const result = bcryptjs.compare(data, hash);
  return result;
};

const bcrypt = {
  compare: compareData,
  hash: hashData
}

module.exports = bcrypt