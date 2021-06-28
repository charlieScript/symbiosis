const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const joi = require('joi');
const jwt = require('../utils/jwt');
const bcrypt = require('bcrypt');


const adminCreateUser = async (req, res) => {
  const {
    email,
    first_name,
    last_name,
    password,
    adminEmail,
    adminPassword,
  } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    password: joi.string().required().min(8).alphanum(),
    adminEmail: joi.string().email().required(),
    adminPassword: joi.string().required().min(8).alphanum(),
  });
  const validation = schema.validate({
    email,
    first_name,
    last_name,
    password,
    adminEmail,
    adminPassword,
  });
  if (validation.error) {
    res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }

  try {
    const verifyAdmin = await prisma.users.findUnique({
      where: {
        email: adminEmail,
      },
    });
    const hashedPassword = await bcrypt.compare(
      adminPassword,
      verifyAdmin.password,
    );
    // if user is an admin give permission to create
    if (verifyAdmin.role === 'admin') {
      // check password
      if (hashedPassword) {
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
        const jsonwebtoken = jwt.create(user.email);

        return res.status(200).json({
          status: '200',
          message: 'user registered',
          jwt: jsonwebtoken,
        });
      } else {
        res.status(403).json({
          status: '403',
          error: 'incorrect password',
        });
      }
    } else {
      res.status(403).json({
        status: '400',
        error: 'you are not permitted!!',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an internal error occurred',
    });
  }
}


// init
const admin = {
  createUser: adminCreateUser
}

module.exports = admin