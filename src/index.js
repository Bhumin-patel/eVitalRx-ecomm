const express = require('express');
const pool = require('./models/postgresql');
const guard = require('./utils/guard');
const cors = require('cors');
require("dotenv").config();

const countryRoutes = require('./api/country/country.routes');
const stateRoutes = require('./api/state/state.routes');
const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const cityRoutes = require('./api/city/city.routes');
const addressRoutes = require('./api/address/address.routes');
const productRoutes = require('./api/product/product.routes');

const app = express();
const port = process.env.PORT || 3000;

let corsOptions = {
    origin: ['http://localhost:3000'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/country', guard.verifyToken, countryRoutes);
app.use('/state', guard.verifyToken, stateRoutes);
app.use('/user', guard.verifyToken, userRoutes);
app.use('/city', guard.verifyToken, cityRoutes);
app.use('/address', guard.verifyToken, addressRoutes);
app.use('/product', guard.verifyToken, productRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});