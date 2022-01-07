const express      = require('express');
const connectDB    = require('./config/database');
const cookieParser = require('cookie-parser');
const fileupload   = require('express-fileupload');
const dotenv       = require('dotenv');
const morgan       = require('morgan');
const errorHandler = require('./middleware/error');
const path         = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet        = require('helmet');
const xss           = require('xss-clean');
const hpp           = require('hpp');
const cors          = require('cors');
const colors        = require('colors');

// Loads env variables 
dotenv.config({ path : './config/config.env' });

// Load database
connectDB()


// Routes files

const auth          = require('./routes/auth');
const productRouter = require('./routes/product');
const carRouter     = require('./routes/car')
const orderRouter   = require('./routes/order');
const userRouter    = require('./routes/user');



// Initializing express app
const app = express();

app.use(express.json());

app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.use(fileupload());

if(process.env.NODE_ENV === 'developpement'){
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public'))) 


// Mounting Route



app.use(auth);
app.use(productRouter);
app.use(carRouter);
app.use(orderRouter);
app.use(userRouter);


// Using middleware

app.use(errorHandler);

// Listening server

app.listen(process.env.PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.bgGreen.bold);
})
