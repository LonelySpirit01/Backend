const express =require('express')
const app= express()
const cookieParser= require('cookie-parser')
const errorMiddleWare=require('./middleware/error')

app.use(express.json())
app.use(cookieParser())

//Routes Imports
const product=require('./routes/productRoutes')
const User=require('./routes/userRoutes')
const order=require('./routes/orderRoutes')

app.use('/api/v1',product)
app.use('/api/v1',User)
app.use('/api/v1',order)

//Middleware
app.use(errorMiddleWare)

module.exports=app