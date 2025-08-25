const mongoose = require('mongoose')
const User = require('../models/userModels')

const contactSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
},{
    timestamps: true
}
)
module.exports = mongoose.model("Contact",contactSchema)
