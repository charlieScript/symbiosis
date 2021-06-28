const jwt = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Protect routes
const protect = async (req, res, next) => {
  let token = '';
  // Check for token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[+!!{}];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.users.findUnique({
        where: {
          email: decoded.data,
        },
      });
      // sends the  user the email to the controller
      req.user = user.email;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({
        status: '403',
        message: 'Not authorized to access this resource',
      });
    }
  }
};



// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(new ErrorResponse(`User role '${req.user.role}' is unauthorised to access this route`), 403);
//     }
//     next();
//   }
// }

const middlewares = {
  protect,
};

module.exports = middlewares;
