const sendToken=(user,statuscode,res)=>{
    const token=user.getJWTToken()
    const options={
        expire: new Date(Date.now()+ process.env.COOKIE_EXPIRE*24*60*60*100),
        httpOnly:true
    }
    res.status(statuscode).cookie("token",token).json({
        success:true,
        user,
        token
    })
}

module.exports=sendToken