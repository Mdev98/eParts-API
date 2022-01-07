const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Product = require('../models/product');
const path    = require('path')

// @desc    Create new product
// @route   POST  /api/v1/product
// @access  Private

exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    })

});

// @desc    Fetch all product
// @route   GET  /api/v1/product
// @access  Public

exports.getProduct = asyncHandler(async (req, res, next) => {

    console.log(res.data.query)

    const products = await Product.find(res.data.query).sort('-createdAt').skip(res.data.startIndex).limit(res.data.limit).populate({path: 'car'});


    res.status(200).json({ success : true, count : products.length, pagination : res.data.pagination, data : products});

});

// @desc    Fetch a single product
// @route   GET  /api/v1/product/:id
// @access  Public

exports.getSingleProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    res.status(200).json({
        success: true,
        data: product
    })

});

// @desc    Update a product
// @route   PUT  /api/v1/products/:id
// @access  Private

exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    if(!product) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true })

    res.status(200).json({
        success: true,
        message: "Product details updated",
        data : product
    })
});

// @desc    Delete a product
// @route   DELETE  /api/v1/product/:id
// @access  Private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    if(!product) {
        return next(new ErrorResponse('Ressource not found', 404))
    }

    product.remove();

    res.status(200).json({
        success: true,
        message: 'Product deleted'
    })
});

// @desc    Update photo for product
// @route   PUT  /api/v1/product/:id/picture
// @access  Private
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  
    const product = await Product.findById(req.params.id);

    if(req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorize', 401));
    }

    if(!product) {
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
    file.name = `photo_${product._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`SERVEUR ERROR : ${err.message}`, 500));
        }

        await Product.findByIdAndUpdate(req.params.id, { picture : file.name })
        res.status(200).json({
            success: true,
            message : "product picture uploaded",
            data : file.name
        })
    })
});