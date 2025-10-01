const mongoose = require('mongoose')

// Global Constants
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

// Establish DB Connection
const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.qt3kpb7.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
    )
    console.log('Database Connected')
    return dbConn
  } catch (error) {
    console.log(error)
  }
}

conn()

module.exports = conn
