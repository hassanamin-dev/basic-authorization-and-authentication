const express = require('express')
const {authMiddleware} = require('../middleware/auth.middleware.js');
const adminMiddleware = require('../middleware/admin.middleware.js');
const uploadMiddleware = require('../middleware/upload.middleware.js')
const {uploadImage, fetchAllImages, deleteImageController} = require('../controllers/image.controller.js')


const router = express.Router();


// upload the image
router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage)

// get all the images
router.get('/get',authMiddleware, fetchAllImages)

// delete the image
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController)

module.exports = router