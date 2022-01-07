const express = require('express');
const router = express.Router();
const advancedResult = require('../middleware/advancedResult');
const Car = require('../models/car');

const { createCar, getCar, getSingleCar } = require('../controllers/car');

const { protect ,authorize } = require('../middleware/auth')

router
    .route(`${process.env.API}/car`)
    .post(protect, authorize('admin'), createCar)
    .get(advancedResult(Car, 'Car'), getCar)

router
    .route(`${process.env.API}/car/:id`)
    .get(getSingleCar)

module.exports = router;