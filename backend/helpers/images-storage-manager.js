const fs = require('fs')
const path = require('path')

// File System Operation: Remove Image from Local Storage
const imageRemoval = (folder, filename) => {
  fs.unlink(path.join(__dirname, `../uploads/${folder}`, filename), (err) => {
    if (err) {
      new Error('Error deleting photo')
    }
  })
}

module.exports = { imageRemoval }
