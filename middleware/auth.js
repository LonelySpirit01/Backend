const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const User= require('../models/userModels')
const ErrorHandler = require('../utils/errorHandler')

exports.isAuthenticatedUser=asyncHandler(async(req,res,next)=>{
    const {token}=req.cookies
    if(!token){
        return next(new ErrorHandler("Please Log in first",401))
    }
    const decodedData=jwt.verify(token,process.env.JWT_Secret)

    req.user= await User.findById(decodedData.id)
    next()
})

exports.authorizeRoles=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} is not authenticated to access this resource`,403))
        }
        next()
    }
}