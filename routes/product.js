const express  = require('express');
const router   = express.Router();
const advancedResult = require('../middleware/advancedResult');
const Product = require('../models/product');

const { createProduct, getProduct, getSingleProduct, updateProduct, deleteProduct, productPhotoUpload } = require('../controllers/product');

const { protect ,authorize } = require('../middleware/auth')

router
    .route(`${process.env.API}/product`)
    .post(protect, authorize('admin'), createProduct)
    .get(advancedResult(Product, 'Product'), getProduct)

router
    .route(`${process.env.API}/product/:id`)
    .get(getSingleProduct)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct)

router
    .route(`${process.env.API}/product/:id/picture`)
    .put(protect, authorize('admin'), productPhotoUpload)

    

module.exports = router;