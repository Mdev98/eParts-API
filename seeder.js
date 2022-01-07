const fs       = require('fs');
const mongoose = require('mongoose');
const colors   = require('colors');
const dotenv   = require('dotenv');

// Load env variables
dotenv.config({path : "./config/config.env"});

// Load model
const Car = require('./models/car');
const Product = require('./models/product');
const User = require('./models/user')

// Connect to DB
mongoose.connect(process.env.DB_URI);

// Read JSON file

const productData = JSON.parse(fs.readFileSync(`${__dirname}/_data/product.json`, 'utf-8'));
const carData = JSON.parse(fs.readFileSync(`${__dirname}/_data/car.json`, 'utf-8'));
const userData = JSON.parse(fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8'));

// Import data to db

const importData = async () => {
    try{
        await Car.create(carData);
        await Product.create(productData);
        await User.create(userData);
        console.log('Data imported'.bgGreen.bold);
        process.exit();
    }catch(e){
        console.log(e);
    }
}

// Delete all data 

const deleteData = async () => {
    try{
        await Car.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Data wiped'.bgRed.bold);
        process.exit();
    }catch(e){
        console.log(e);
    }
}


if(process.argv[2] === "-i") {
    importData();
}else if (process.argv[2] === "-d") {
    deleteData();
}