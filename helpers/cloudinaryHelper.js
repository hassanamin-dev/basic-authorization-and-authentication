const cloudinary = require('../config/cloudinary.js');

const uploadToCloudinary = async (filePath) =>  {
    try {
        const result = await cloudinary.uploader.upload(filePath)
        return {
            url : result.secure_url,
            publicId: result.public_id
        }
    } catch (error) {
    console.log('error while uploading image to cloudinary', error);
    throw new Error("error while uploading image to cloudinary")
    }
}

module.exports = uploadToCloudinary