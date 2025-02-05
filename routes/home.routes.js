const express = require('express')
const { authMiddleware } = require('../middleware/auth.middleware.js')
const route = express.Router();

route.get('/welcome', authMiddleware, (req, res)=>{
    res.status(200).json({
        message: "welcome"
    })
})

module.exports = route