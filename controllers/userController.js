const User = require('../models/userModels')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const getAllUsers = asynchandler(async (req,res)=>{
        const user = await User.find()
        if(user.length===0){
                throw new Error("No users available");
        }
        res.json({user})
})
const loginUser = asynchandler(async (req,res)=>{
        const{email, password} = req.body
        if (!email || !password) {
            throw new Error("All fields are required");
        }
        const user = await User.findOne({email})
        console.log(user,"  ",user.password)
        const match = await bcrypt.compare(password, user.password);        
        if(!match) {
            throw new Error("Password does not match!!!!");
        }
        const accessToken = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + 24* (60 * 60),
          data: {
                name: user.name,
                email
          }
        },process.env.ACCESS_TOKEN);
        res.status(200).json({accessToken})

})
const registerUser = asynchandler(async (req, res) => {
        const { name, email, password} = req.body;
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }
        const alreadyUser = await User.findOne({email})
        if(alreadyUser){
            throw new Error("User alraedy exists")
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            username: name,
            email,
            password:hashedPassword
        })
        console.log(user)
        res.status(201).json({"user._id":user.id, "user_email": user.email})
})
const getUserById = asynchandler(async (req,res)=>{
        const user = await User.findById(req.params.id)
        if(!user){
                throw new Error("User doesn't exist");
        }
        res.json(user)
})

const updateUser = asynchandler(async (req,res)=>{
        const { name, email, number } = req.body;
        if (!name || !email || !number) {
            throw new Error("All fields are required");
        }
        const user = await User.findById(req.params.id)
        if(!user){
                throw new Error("User doesn't exist");
        }
        const newUser = await User.findByIdAndUpdate(req.params.id, {name, email, number}, {new:true})
        res.json({message: "User Updated to "},newUser)
})

const deleteUser = asynchandler(async (req,res)=>{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
                throw new Error("User doesn't exist");
        }
        res.status(202).json({message: "User deleted: \n"}, user)
})

module.exports = {getAllUsers,getUserById , loginUser,
                registerUser, updateUser, 
                deleteUser}
