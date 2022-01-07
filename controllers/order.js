const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Order = require('../models/order');

// @desc    Create new order
// @route   POST  /api/v1/order
// @access  Private

exports.createOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.create(req.body);
    console.log(order)

    res.status(201).json({
        success: true,
        data: order
    })
})

// @desc    Get all order
// @route   POST  /api/v1/order
// @access  Private

exports.getOrder = asyncHandler(async(req, res, next) => {
    const orders = await Order.find({});

    res.status(200).json({
        success: true,
        data: orders
    })
})

// @desc    Get single order
// @route   POST  /api/v1/order/:id
// @access  Private

exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: order
    })
})


// @desc    Get my order
// @route   POST  /api/v1/order/me
// @access  Private

exports.getMyOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.find({
        customer : req.user
    })

    res.status(200).json({
        success: true,
        data: order
    })
})
