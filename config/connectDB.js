const mongoose = require('mongoose')

const connectDB = async() =>{
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Db name is ",connect.connection.name)
    } catch (error) {
        console.log(error, "error while connecting to DB")
    }
}
module.exports = connectDB