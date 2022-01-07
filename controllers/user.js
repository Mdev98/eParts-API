const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const setTokenResponse = require('../utils/TokenResponse');

const User = require('../models/user');
const path = require('path');

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private 
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  
    res.status(201).json({
      success: true,
      data: user
    });
  });

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private
exports.getUsers = asyncHandler(async (req, res, next) => {

  const users = await User.find(res.data.query).sort('-createdAt').skip(res.data.startIndex).limit(res.data.limit);

  res.status(200).json({ success : true, count : users.length, pagination : res.data.pagination, data : users});
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});


// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});



// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Update user details
// @route     PUT /api/v1/me
// @access    Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        fname: req.body.fname,
        lname: req.body.lname,
    };


    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      success: true,
      data: user
    });
});

// @desc      Update user password
// @route     PUT /api/v1/me/password
// @access    Private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    setTokenResponse(user, 200, res);
});

// @desc    Update user profile picture
// @route   PUT  /api/v1/me/profile
// @access  Private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
    const user = req.user

    if(!user) {
        return next(new ErrorResponse(`ressource doesn't exist`, 404));
    }

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;


    // Check file type
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload a image`, 400));
    }

    // Check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload a image less than 1MB`, 400));
    }

    // Custom image file name
    file.name = `profile_${user._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`SERVEUR ERROR : ${err.message}`, 500));
        }

        await User.findByIdAndUpdate(req.params.id, { profile : file.name })
        res.status(200).json({
            success: true,
            message : "product picture uploaded",
            data : file.name
        })
    })
});

