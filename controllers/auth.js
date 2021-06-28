const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const joi = require('joi');
const bcrypt = require('../utils/bcrypt');
const bcryptjs = require('bcrypt');
const jwt = require('../utils/jwt');
const crypto = require('crypto');


/**
 * @desc    sign up
 * @route   POST /api/v1/users/signup
 * @access  Public
 */
const signup = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    password: joi.string().required().min(8).alphanum(),
  });
  const validation = schema.validate({
    email,
    first_name,
    last_name,
    password,
  });
  if (validation.error) {
    res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }
  try {
    const alreadyRegistered = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (alreadyRegistered) {
      return res.status(400).json({
        status: '401',
        error: 'user is already registered try logging in instead',
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        role: 'employee',
      },
    });

    // jwt
    const jsonwebtoken = jwt.create(user.email);

    return res.status(200).json({
      status: '200',
      message: 'user registered',
      jwt: jsonwebtoken,
    });
  } catch (error) {
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    signin
 * @route   POST /api/v1/users/signin
 * @access  Public
 */
const signin = async (req, res) => {
  const { email, password } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(8).alphanum(),
  });
  const validation = schema.validate({
    email,
    password,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    // if user is null found
    if (user !== null) {
      const hashedPassword = await bcrypt.compare(password, user.password);
      // if password is correct
      const jsonwebtoken = jwt.create(user.email);

      if (hashedPassword) {
        return res.status(200).json({
          status: '200',
          message: 'user logged in',
          jwt: jsonwebtoken
        });
      } else {
        return res.status(200).json({
          status: '200',
          error: 'incorrect password',
        });
      }
    } else {
      return res.status(404).json({
        status: '404',
        error: 'user not registered',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};



/**
 * @desc    Get password reset token
 * @route   POST /api/v1/users/reset
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
  });
  const validation = schema.validate({
    email,
  });
  if (validation.error) {
    res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }
  try {
    // send the user a link to reset its password

    //create a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/reset/${resetToken}`;

    // check if the email exists in the database and update it reset fields
    const alreadyRegistered = await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        // set token expiriry date to 30mins
        resetPasswordExpirationDate: `${Date.now() + 30 * 60 * 1000}`,

        // set token using cryto hash
        resetPasswordToken: crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex'),
      },
    });
    res.status(200).json({
      status: '200',
      message: {
        resetLink: resetUrl,
      },
    });
    // if user is not found
    if (!alreadyRegistered) {
      res.status(404).json({
        status: '404',
        error: 'this user is not registered contact admin',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    verify email reset token and change password
 * @route   POST /api/v1/users/reset/:resetToken
 * @access  Public
 * @field password
 */
const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const schema = joi.object({
    resetToken: joi.string().required(),
    password: joi.string().alphanum().min(8),
  });
  const validation = schema.validate({
    resetToken,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }

  try {
    // verify reset token  and scan database using that token
    const verifiedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // search database using that token
    const user = await prisma.users.findUnique({
      where: {
        resetPasswordToken: verifiedToken,
      },
    });
    // if the user is found with that link
    if (user) {
      // checks if the reset link is still valid
      if (Date.now() >= user.resetPasswordExpirationDate) {
        res.status(400).json({
          status: '200',
          error: 'the link is invalid please request for a new one',
        });
      } else {
        // hashed the password
        const newPassword = await bcryptjs.hash(password);
        await prisma.users.update({
          where: {
            email: user.email,
          },
          data: {
            password: newPassword,
          },
        });
        res.status(400).json({
          status: '200',
          message: 'password changed please login',
        });
      }
    } else {
      return res.status(404).json({
        status: '404',
        error: 'the link is invalid',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

// call functions here
const auth = {
  forgotPassword,
  resetPassword,
  signin,
  signup
};

module.exports = auth;
