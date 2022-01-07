const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Car = require('../models/car');

// @desc    Create new car
// @route   POST  /api/v1/car
// @access  Private

exports.createCar = asyncHandler(async (req, res, next) => {
    const car = await Car.create(req.body);

    res.status(201).json({
        success: true,
        data: car
    })

});


// @desc    Fetch all car
// @route   GET  /api/v1/car
// @access  Public

exports.getCar = asyncHandler(async (req, res, next) => {

    const cars = await Car.find(res.data.query).sort('-createdAt').skip(res.data.startIndex).limit(res.data.limit).populate({path: 'products'}).exec();

    res.status(200).json({ success : true, count : cars.length, pagination : res.data.pagination, data : cars});
})

// @desc    Fetch single car
// @route   GET  /api/v1/car/:id
// @access  Public

exports.getSingleCar = asyncHandler(async (req, res, next) => {
    const car = await Car.findById(req.params.id);

    if(!car) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    res.status(200).json({
        success: true,
        data: car
    })
})

// @desc    Update a car
// @route   PUT  /api/v1/car/:id
// @access  Private

exports.updateCar = asyncHandler(async (req, res, next) => {
    const car = await Car.findOneAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if(!car) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    res.status(200).json({
        success: true,
        message: 'Data updated !'
    })
})

// @desc    Delete a car
// @route   DELETE  /api/v1/car/:id
// @access  Private

exports.deleteCar = asyncHandler(async (req, res, next) => {
    const car = await Car.findById(req.params.id)

    if(!car) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    res.status(200).json({
        success: true,
        message: 'Data deleted'
    })
})





