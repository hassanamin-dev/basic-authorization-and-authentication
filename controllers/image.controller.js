const Image = require('../model/image.model.js')
const uploadToCloudinary = require('../helpers/cloudinaryHelper.js')
const fs = require('fs')
const cloudinary = require('../config/cloudinary.js')

const uploadImage = async (req, res) =>{
    try {
        
        // check if file is missing in req object
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "File is required. Please upload an image"
            })
        }

        // upload to cloudinary
        const {url , publicId } = await uploadToCloudinary(req.file.path)
        // now the upload is completed 
        // now store the url and publicId in the database

        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.info.userId
        })

        await newlyUploadedImage.save();

        // delte if the image has been saved successfully from local storage
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            sucess: true,
            message: "image uploaded successfully",
            image: newlyUploadedImage

        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some thing went wrong please try again"
        })
    }
}


const fetchAllImages = async (req, res)=>{
    try {

        // sorting
        const page = parseInt(req.query.page) || 1; // default: page 1
        const limit = parseInt(req.query.limit) || 2; // Default : 5 results per page
        const skip = (page -1) * limit 

        // pagination
        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit)

        const sortObj = {};
        sortObj[sortBy] = sortOrder





        const images = await Image.find().sort(sortObj).skip(skip).limit(limit)
        if(images){
            res.status(200).json({
                success: true,
                currentPage : page,
                totalPages: totalPages,
                totalImages : totalImages,
                data: {
                    images
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some thing went wrong please try again"
        })
    }
}

const deleteImageController = async (req, res)=> {
    try {
        const getCurrentIdofImageToBeDeleted = req.params.id;
        const userId = req.info.userId;

        const image = await Image.findById(getCurrentIdofImageToBeDeleted);

        if(!image){
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        // check if the image is uploaded by the current user who is trying to delete the image
        if(image.uploadedBy.toString() !== userId){
                return res.status(400).json({
                    success: false,
                    message: "You are not authorized to delte this image"
                })
        }

        // delete image first from the cloudinary
        await cloudinary.uploader.destroy(image)

        // delete this image from database
        await Image.findByIdAndDelete(getCurrentIdofImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some thing went wrong please try again"
        })
    }
}
module.exports = {uploadImage, fetchAllImages, deleteImageController}