const User = require('../models/userModels')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { generateAccessAndRefereshTokens } = require('../utils/tokens');
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shafinmirkar2@gmail.com",
    pass: "zjnj broj gtim tamv"
  }
});

function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  console.log(generateOTP());
  return otp;
}

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
        if(user.isActivated===false){
                throw new Error("User is not Verified")
                // route user to verify register (email verification again)
        }

        console.log("Logging the User in")
        const match = await bcrypt.compare(password, user.password);        
        if(!match) {
            throw new Error("Password does not match!!!!");
        }
        const otp = generateOTP();
        user.loginOtp = await bcrypt.hash(otp, 10);  
        user.otpExpiry = Date.now() + 2 * 60 * 1000; 
        await user.save();

        const mailOptions = {
                from: "noreply@TaskManager.com",
                to: email,
                subject: "Login Verification",
                html: `<h2>The OTP is :<em>${otp}</em></h2>`
        }
        const tempToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: user.otpExpiry } 
          );

  
        try {
                await transporter.sendMail(mailOptions)
        } catch (err) {
                throw new Error("Error while sending OTP verification mailOptions", err)
        }
        res.json({ message: "Check inbox for OTP", tempToken });
})
const registerUser = asynchandler(async (req, res) => {
        console.log("Register user is Hit!!")
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
            name,
            email,
            password:hashedPassword,
            isActivated: false
        })
        console.log(user)
        res.status(201).json({"user._id":user.id, "user_email": user.email})
        verifyToken = jwt.sign({ email }, process.env.VERIFY_TOKEN_SECRET, { expiresIn: "1d" });

        const link = `http://localhost:${process.env.PORT}/verify?token=${verify}&email=${email}`;
        const mailOptions = {
                from: "noreply@TaskManager.com",
                to: email,
                subject: "Email Verification",
                html: `<h3>Click below to verify your email:</h3>
                        <a href="${link}">${link}</a>`
        }
        await transporter.sendMail(mailOptions)
        res.status(202).send("Check your inbox for verification")
})
const verifyUser = asynchandler(async (req,res)=>{
        const {token, email} = req.query
        console.log("Verifying user")
        if (await jwt.verify(token , process.env.VERIFY_TOKEN_SECRET)){
                const user = await User.findOne({email})
                user.isActivated = true
                console.log(user)
                res.status(201).send("Verified and registered user: ", user)
        }       
        else{
                throw new Error ("Verification failed")
        }
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
                deleteUser,verifyUser}
