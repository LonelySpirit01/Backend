const ErrorHandler= require("../utils/errorHandler")

module.exports=(err,req,res,next)=>{
    err.statuscode= err.statuscode || 500
    err.messsage=err.message || 'Internal server error'

//Wrong id error
if(err.name=='CastError'){
    const message= `Resurce Not Found .Invalid: ${err.path} `
    err=new ErrorHandler(message,400)
}

//Mongoose Duplicate key error
if(err.code===11000){
    const message=` Duplicate ${Object.keys(err.keyValue)} entered`
    err=new ErrorHandler(message,400)
}

//Wrong JWT error
if(err.name==='JsonWebTokenError'){
    const message=` Json token is invalid, try again !`
    err=new ErrorHandler(message,400)
}

//Token expired error
if(err.name==='TokenExpiredError'){
    const message='Json Token expired ,try again!'
    err=new ErrorHandler(message,400)
}


res.status(err.statuscode).json({
        success:false,
        message:err.message,
        error:err.stack,
    })
}