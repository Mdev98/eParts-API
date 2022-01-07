const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const { findById } = require('../models/user');

// Protect Route

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.Token) {
      token = req.cookies.Token
    }


    if(!token){
        return next(new ErrorResponse('Not authorize, please authenticate', 401))
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id)

        next()
    }catch(e){
        next(new ErrorResponse(e.message , 401))
    }
})

// Grant access to specific roles

exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `User role ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    };
  };