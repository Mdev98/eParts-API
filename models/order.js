const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    cartList : [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: {
                type: Number,
                default: 1
            },
            amount : {
                type: Number
            }
        }
    ],

    amount : {
        type : Number
    },

    shipping_adress : { 
        type : String,
        required : ['true', 'A shipping adress is required']
    },

    shipping_adress2: {
        type : String,
        required : false
    },
    city : {
        type : String,
        required : ['true', 'A city is required']
    },
    country : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    }, 
    status : {
        type : String,
        default: "Waiting"
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)