// const crypto = require('crypto')
// const resetPasswordToken = crypto
//   .createHash('sha256')
//   .update('charles')
//   .digest('hex');

// console.log(resetPasswordToken)

// const resetToken = crypto.randomBytes(20).toString('hex');
// let newtoken = crypto.createHash('sha256').update(resetToken).digest('hex');

// console.log(resetToken, newtoken)

//  // Hash token & set to resetPasswordToken field
// //  this.resetPasswordToken = crypto
// //    .createHash('sha256')
// //    .update(resetToken)
// //    .digest('hex');

// //  // Set expiration in 20mins
// //  this.resetPasswordExpiration = Date.now() + 20 * 60 * 1000;

// //  return resetToken;

// // Create reset URL
//   // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset/${resetToken}`;
//   // const message = `You are recieving this email because you (or someone else😏) has requested
//   // the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\n P.S: It expires after 20 minutes🕓`;

//  // Get hashed token
//   // const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

//   //   const resetPasswordExpiration = Date.now() + 120 * 60 * 1000;
//   //   console.log(resetPasswordExpiration)
//   //   const newDate = new Date(resetPasswordExpiration);
//   //   if (Date.now() > resetPasswordExpiration) {
//   //     console.log('true')
//   //   } else {
//   //     console.log('false')
//   //   }
//   // console.log(newDate.toLocaleTimeString())
const fs = require('fs');
const path = require('path');

const run = async () => {
  try {
    // seartch for file
    const dat = await fs.promises.readFile('test.txt');
    // if file is found
    if (dat) {
      await fs.promises.unlink('test.txt');
      console.log('file deleted')
    }
  } catch (error) {
    if (error.errno === -2) {
      console.log(error)
    }
  }
  
}

// const file = fs.readFileSync('test.txt', {
//   encoding: 'utf-8',
// });

run()