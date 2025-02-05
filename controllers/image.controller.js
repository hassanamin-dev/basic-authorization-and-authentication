const Image = require('../model/image.model.js')
const uploadToCloudinary = require('../helpers/cloudinaryHelper.js')
const fs = require('fs')

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
        const images = await Image.find({})
        if(images){
            res.status(200).json({
                success: true,
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
module.exports = {uploadImage, fetchAllImages}