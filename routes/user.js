const express = require('express');
const router = express.Router();

const { getUsers, getUser, createUser, updateUser, updateUserDetails, updateUserPassword, deleteUser, userPhotoUpload } = require('../controllers/user');
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const User = require('../models/user');

router.use(protect);

router
    .route(`${process.env.API}/users`)
    .post(authorize('admin'), createUser)
    .get(advancedResult(User, 'User'), authorize('admin'), getUsers)

router
    .route(`${process.env.API}/users/:id`)
    .get(authorize('admin'), getUser)
    .put(authorize('admin'), updateUser)
    .delete(authorize('admin'), deleteUser)

router
    .route(`${process.env.API}/me`)
    .put(updateUserDetails)

router
    .route(`${process.env.API}/me/password`)
    .put(updateUserPassword)

router
    .route(`${process.env.API}/me/profile`)
    .put(userPhotoUpload)

module.exports = router;
