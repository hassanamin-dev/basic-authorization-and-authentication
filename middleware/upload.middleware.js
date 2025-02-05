const multer = require('multer')
const path = require('path')

// set our multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})


// file filter function

const checkFileFilter = (req, file, cb)=> {
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }else{
    cb(new Error("Not an image! please upload inly images"))
  }
}

// multer middleware 
module.exports = multer({
  storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
})