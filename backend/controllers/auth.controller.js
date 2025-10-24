import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateJwtAndSetToken } from "../utils/generateJwtAndSetCookies.js";
import { sendVerificationMail, sendWelcomeEmail, sendForgotPasswordEmail, sendResetSuccessfullEmail } from "../mailtrap/emails.js";
import crypto from 'crypto';

export const Signup = async (req, res) => {
    try {
        const { email, password, name} = req.body;

        if(!email || !password || !name){
            throw new Error("All inputs should be provided");
        }

        const userAlreadExists = await User.findOne({
            email : email
        })

        if(userAlreadExists) {
            return res.status(400).json({
                success : false,
                msg : "User Already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();//creates a 6 digit code 

        const user = new User({
            //always save email in lowercase with trim() to avoid case sensitivity  
            email : email.toLowerCase().trim(),
            password : hashedPassword,
            name,
            verificationToken : verificationToken,
            verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000 // aaj se  + 24 hours m token expire hojyega
        })
        

        await user.save();

        generateJwtAndSetToken(res,user._id);

        
        await sendVerificationMail(user.email, verificationToken);

        return res.status(201).json({
            success : true, 
            msg : "user have successfully signed up, Please verify your email",
            user : {
                ...user._doc,
                password : undefined
            }
        })

    
    } catch (error) {
        return res.status(400).json({success : false, msg : error.message});
    }
}

export const verifyEmail = async(req,res) => {
    try {
        const {code} = req.body;
        console.log(code);
        const user = await User.findOne({
            verificationToken : code,
            verificationTokenExpiresAt : {$gt : Date.now()}//if verificationTokenExpiresAt is greater than(gt) the todays date means expired 
        })


        if(!user){
            return res.status(400).json({success : false, msg : "Invalid or expired verification code"});
        }

        user.isVerified = true;//makes user verified
        //remove the verificatoinToken and verificationTokenExpiresAt fields as it does not require now 
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        console.log("reached at the end");

       await sendWelcomeEmail(user.email, user.name);

        return res.status(201).json({
            success : true,
            msg : "Email verified successfully",
            user : {
                ...user._doc,
                password : undefined
            }
        })
    } catch (error) {
        console.error("error occured while verifying the email", error.message);
        return res.status(400).json({success : false, msg : error})
    }

}

export const Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({success : false, msg : "Email and password must be provided"});
            return;
        }

        const user = await User.findOne({
            email : email.toLowerCase().trim()
        })

        if(!user){
            res.status(404).json({success : false, msg : "Invalid Credentials"});
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(404).json({success : false, msg : "Invalid credentials"});
        }

        if(!user.isVerified){
            return res.status(400).json({
                success : false,
                msg : "Please verified your email before loggin"
            })
        }

        await generateJwtAndSetToken(res, user._id);

        user.lastLogin = new Date();//update the last log in time and save in DB
        await user.save();

        return res.status(200).json({
            success : true,
            msg : "User logged in successfully",
            user : {
                ...user._doc,
                password : undefined
            }
        })
    } catch (error) {
        console.error("Error occurred in login ", error);
        return res.status(500).json({success : false, msg : error.msg});
    }
}

export const resendVerificationEmail = async(req,res) => {
    const {email} = req.body;

    const user = await User.findOne({
        email : email.toLowerCase().trim()
    })

    if(!user){
        return res.status(404).json({success : false, msg: "User not found"})
    }

    if (user.isVerified) {
            return res.status(400).json({
                success: false,
                msg: "Email is already verified"
        });
    } 

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    user.verificationToken = verificationCode;
    user.verificationTokenExpiresAt = verificationTokenExpiresAt;
    await user.save();

    await sendVerificationMail(user.email, verificationCode);

    res.status(200).json({
        success : true,
        msg : "email sent again successfully",
        user : {
            ...user._doc,
            password : undefined
        }
    })

}

export const Logout = async (req, res) => {
    res.clearCookie("token");
    res.status(201).json({
        status : true,
        msg : "You have logged out successfully"
    })
}

export const forgotPassword = async(req, res) => {
    const {email} = req.body;

   try {
        const user = await User.findOne({
        email : email.toLowerCase().trim()
        })

        if(!user){
            return res.status(404).json({success:false, msg : "User not found"});
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;//1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save()

        await sendForgotPasswordEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success : true, msg : "Password reset link has been sent to your email"});


   } catch (error) {
        console.log("error occurred during forgotPassword", error);
        return res.status(500).json({success : false, msg : error.message});
   }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;


        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpiresAt : { $gt : Date.now()},
        })

        if(!user){
            return res.status(404).json({success : false, msg : "User not found"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessfullEmail(user.email);

        res.status(200).json({success : true, msg : "Password reset successfully"});
    } catch (error) {
        console.log("error during resetting the password", error);
        res.status(500).json({success : false, msg : error.message});
    }

}

export const checkAuth = async(req, res) => {
   try {
        const userId = req.userId;

        if(!userId){
            return res.status(400).json({success: false, msg : "User is not logged in"});
        }

        const user = await User.findOne({_id : userId}).select("-password");

        if(!user){
            return res.status(404).json({success : false, msg : "User not found"});
        }

        res.status(200).json({success : true, user})
   } catch (error) {
        console.log("error while verifying user in checkauth function");
        res.status(500).json({success : false, msg : error.message});
   }
}
