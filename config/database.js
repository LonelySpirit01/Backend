const mongoose =require('mongoose')

const connectdb=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((data)=>{
        console.log(`Connected to ${data.connection.host}`)})
        }

module.exports=connectdb