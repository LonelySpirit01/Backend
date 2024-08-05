const app =require('./app')
const dotenv= require('dotenv')
const connectdb = require('./config/database')

//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log('Shutting down server due to uncaught Exception')
    process.exit(1)
})

//config
dotenv.config({path:'backend/config/config.env'})

//Connecting database
connectdb()

const server=app.listen(process.env.PORT,()=>{
    console.log(`Connected to port ${process.env.PORT}`)
})

//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`)
    console.log('Shutting down server due to unhandled promise rejection')
    server.close(()=>{
        process.exit(1)
    })
})




