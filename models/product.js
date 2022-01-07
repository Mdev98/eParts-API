const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type: String,
        required: ['true', 'please specify the title of the product']
    },

    price : {
        type: Number,
        required: ['true', 'Please specify the price of the product'] 
    },

    part_type: {
        type: String,
        required: ['true', 'Please specify the part type of the product']
    },
    
    sku: {
        type: String,
        required: ['true', 'Please specify a sku for the product']
    },

    brand: {
        type: String,
        required: ['true', 'Please specify the brand of the product']
    },

    part_number: {
        type: String,
        required: [ 'true', 'Please specify a the part number of the product']
    },

    condition: {
        type: String,
        required: ['true', 'Please specify the condition of the product']
    },

    warranty: {
        type: Boolean,
        default: true
    },

    picture: {
        type: String,
        default: 'no-picture.jpg'
    },

    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: ['true', 'Please specify the car']
    }
})

module.exports = mongoose.model('Product', productSchema)