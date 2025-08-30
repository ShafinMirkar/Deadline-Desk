const asynchandler = require('express-async-handler')

export const verify_otp = asynchandler( async(req,res)=>{
    const  otp = req.body
    const OTP_Token = req.headers.OTP_Token ;
    if (!OTP_Token) {
        res.status(401);
        throw new Error("No authorization header or token absent");
    }    
    decoded = await jwt.verify(OTP_Token,process.env.OTP_SECRET)
    if(!decoded){
        throw new Error("OTP_Token is invalid or expired session")
    }
    const user = await User.findById(decoded.id);
    if(!user.loginOtp || Date.now()>user.otpExpiry){
        throw new Error("OTP expired or not generated")
    }
    const isMatch = bcrypt.compare(user.loginOtp, otp)
    if(!isMatch ){
        throw new Error("Invalid OTP")
    }
    
    user.loginOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    // access token n refesh token generate krke response send kar

})