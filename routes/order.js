const express = require('express');
const router = express.Router();

const { createOrder, getOrder, getSingleOrder, getMyOrder } = require('../controllers/order');
const { protect, authorize } = require('../middleware/auth');

router
    .route(`${process.env.API}/order`)
    .post(protect,createOrder)
    .get(protect, authorize('admin'), getOrder)

router
    .route(`${process.env.API}/order/:id`)
    .get(protect, authorize('admin'), getSingleOrder)

router
    .route(`${process.env.API}/me/order`)
    .get(protect, getMyOrder)

module.exports = router;