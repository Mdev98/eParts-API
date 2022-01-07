const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: {
        type: String, 
        required: ['true', 'Please specify the make of the car']
    },

    model: {
        type: String,
        required: ['true', 'Please specify the model of the car']
    },
    
    year: {
        type: Number,
        required: ['true', 'Please specify the year of the car']
    }
    
},{
    toJSON : { virtuals : true },
    toObject: { virtuals : true},
    timestamps : true
})

carSchema.virtual('products', {
    ref : 'Product',
    localField : '_id',
    foreignField : 'car'
})

module.exports = mongoose.model('Car', carSchema)