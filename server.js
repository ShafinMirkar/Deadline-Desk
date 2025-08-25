const express = require('express')
const connectDB = require('./config/connectDB.js')

require('dotenv').config()


const app = express()
const port = process.env.PORT || 3001


// middlewares
app.use(express.json());
app.use('/api/contacts',require('./routes/contactRoutes.js'))
app.use('/user',require('./routes/userRoutes.js'))

connectDB()
.then(()=>{
    app.listen(port, ()=>{
    console.log("server is On, " , port)
})
})
.catch(()=>{
    throw new Error("DB connection failed");
})