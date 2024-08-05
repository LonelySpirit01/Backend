const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userScehma=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[2,"Name should have atleast 2 characters"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please provide email"],
        validate:[validator.isEmail,"Proivde valid email"]
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minLength:[8,"Password should be atleast 8 character large"],
        select:false
    },
    avatar:{
            public_id: {
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default: "user"
    },
   
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

//Encrypt password
userScehma.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

//JWT Token
userScehma.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_Secret,{
        expiresIn:process.env.JWT_Expire})
}

//Compare Password
userScehma.methods.comparePassword= async function(enteredPassword){
return await bcrypt.compare(enteredPassword,this.password)
}

//Generate Reset Password Token
userScehma.methods.resetPassword=function(){
//Generating Token
const  resetToken=crypto.randomBytes(20).toString('hex')

//Hashing and adding reset password to user scehma
this.resetPasswordToken= crypto.createHash('sha256').update(resetToken).digest('hex')

//Expiration time
this.resetPasswordExpire= Date.now()+15*60*1000
return resetToken
}
module.exports = mongoose.model("User",userScehma)