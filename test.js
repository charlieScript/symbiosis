const bcrypt = require('bcrypt');

(async () => {
  const hash = await bcrypt.hash('chigozie1999',);
  console.log(hash);
})();
