const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JSON WEB TOKEN
const createToken = (email) => {
  const token = jwt.sign({ email }, 'chigoziecharlesonedibe', {
    expiresIn: '5 days',
  });
  return token;
};

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
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const jsonwebtoken = createToken(user.email);

    return res.status(200).json({
      status: '200',
      message: 'user registered',
      jwt: jsonwebtoken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

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
    res.status(400).json({
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
      if (hashedPassword) {
        res.status(200).json({
          status: '200',
          message: 'user logged in',
        });
      } else {
        res.status(200).json({
          status: '200',
          error: 'incorrect password',
        });
      }
    } else {
      res.status(404).json({
        status: '404',
        error: 'user not registered',
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

// init
const users = {
  signin,
  signup
}


module.exports = users