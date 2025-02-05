require('dotenv').config();
const express = require('express')
const app = express();
const authRoutes = require('./routes/auth.routes.js')
const homeRoute = require('./routes/home.routes.js')
const adminRoute = require('./routes/admin.routes.js')
const uploadImageRoutes = require('./routes/image.routes.js')
const connectDb = require('./db/connect.js')

const port = process.env.PORT || 3000;

connectDb();

//middleware

app.use(express.json());

// routes 
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoute);
app.use('/api/admin', adminRoute);
app.use('/api/image', uploadImageRoutes);

app.listen(port, ()=> {
    console.log(`server is listening at port ${port}`)
})