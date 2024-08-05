const ErrorHandler = require("../utils/errorHandler")
const asyncHandler=require('express-async-handler')
const User= require("../models/userModels")
const sendToken=require('../utils/jwtToken')
const sendEmail=require('../utils/sendEmail')
const catchAsyncError = require("../middleware/catchAsyncError")
const crypto= require('crypto')

//Register user
exports.registerUser=asyncHandler(async(req,res,next)=>{
    const {name,email,password}=req.body
    const user= await User.create({
        name,email,password,avatar:{
            public_id: "sampleid",
            url:"sampleurl"
        }})
        sendToken(user,200,res)
    })

//Login user
exports.loginUser= asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email||!password){
        return next(new ErrorHandler("Please enter password and email",400))
    }
    const user=await User.findOne({email }).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or password",401))
    }
    const isPasswordMatched= await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or password",401))
    }
    sendToken(user,201,res) 
    
})

//Logout user
exports.logOut=asyncHandler(async(req,res,next)=>{

    res.cookie("token",null,{expire:new Date(Date.now()),httpOnly:true })
    res.status(201).json({success:true,message:"Logged Out"})
})

//Forget password
exports.forgetPassword=catchAsyncError(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User not found"),404)
    }

    //Get Reset Password Token
    const resetToken=user.resetPassword()
    await user.save({validateBeforeSave:false})

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message=`Your password reset link is \n \n ${resetPasswordUrl} \n \n If this request was not made by you ,please take required actions`

    try{
        await sendEmail({
            email:user.email,
            subject:'Password recovery mail for Ecommerce website',
            message
        })
        res.status(200).json({success:true,message:`Email sent to ${user.email} successfully`})
    }catch(error){
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }
    
})

//Reset Password
exports.resetPassword=asyncHandler(async(req,res,next)=>{
 
    //Hashing password
    const resetPasswordToken= crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user= await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    if(!user){
        return next(new ErrorHandler("Password token is invalid or  has expired"),400)
    }
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match"),400)
    }
    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save()

    sendToken(user,200,res)
})

//Get user details
exports.getUserDetails=asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

//Update Password
exports.updatePassword=asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password")
    const isPasswordMatched= await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password does not match",400))
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }
    user.password=req.body.newPassword
    await user.save()
    sendToken(user,200,res) 
})

//Update Profile
exports.updateProfile=asyncHandler(async(req,res,next)=>{
    const newUserData={name:req.body.name, email:req.body.email}

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})

//Get all users
exports.findUsers=asyncHandler(async(req,res,next)=>{

    const users=await User.find()
    res.status(200).json({success:true,users})
})

//Get User by ID
exports.getUser=asyncHandler(async(req,res,next)=>{

    const user=await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`User ${req.params.id} not found`,404))
    }
    res.status(200).json({success:true,user})
})

//Update user Role --ADMIN
exports.updateUserRole=asyncHandler(async(req,res,next)=>{
    const newUserData={name:req.body.name,
         email:req.body.email,
        role:req.body.role}

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})

//Delete user --ADMIN
exports.deleteUser=asyncHandler(async(req,res,next)=>{

    const user=await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`User with id ${req.params.id} does not exist`))
    }
    await user.deleteOne()
    res.status(200).json({success:true,message:"User Deleted Successfully"})
})


