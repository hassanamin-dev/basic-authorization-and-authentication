const express = require('express')
const { authMiddleware }= require('../middleware/auth.middleware.js')
const admin = require('../middleware/admin.middleware.js')

// const adminMiddleware = require('../middleware/')

const route = express.Router()

route.get('/welcome', authMiddleware, admin, (req, res)=> {
    res.status(200).json({
        message: "Welcome to admin page" 
    })
})

module.exports = route