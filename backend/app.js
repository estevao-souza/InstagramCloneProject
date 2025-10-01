// Environment Variables
require('dotenv').config()

// Global Constants
const port = process.env.PORT
const frontEndOrigin = process.env.FRONT_END_ORIGIN

// Express: App Initializer
const express = require('express')
const app = express()

// Enable JSON and url-encoded Request
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// CORS Management
const cors = require('cors')
app.use(cors({ credentials: true, origin: frontEndOrigin }))

// Image Upload Directory
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// DB Connection
require('./config/db.js')

// Routes Config
const router = require('./routes/Router.js')
app.use(router)

// Run App
app.listen(port, () => {
  console.log(`Runing App on Port ${port}`)
})
