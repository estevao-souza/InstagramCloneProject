const multer = require('multer')
const { v4: uuid } = require('uuid')
const path = require('path')

// Multer Operation: Set Image File Store Destination and Name
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = ''

    // Segment Local Storage by Endpoint Path
    if (req.baseUrl.includes('users')) {
      folder = 'users'
    } else if (req.baseUrl.includes('posts')) {
      folder = 'posts'
    }

    // Callback: File Directory
    cb(null, `uploads/${folder}`)
  },
  filename: (req, file, cb) => {
    // Callback: Rename File (UUID + File Extension)
    cb(null, uuid() + path.extname(file.originalname))
  },
})

// Multer Operation: Upload Image
const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    // Check File Extension (Only accepts .png or .jpg files)
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Please, upload only PNG or JPG Photos'))
    }

    // Callback: Continue
    cb(undefined, true)
  },
})

module.exports = { imageUpload }
