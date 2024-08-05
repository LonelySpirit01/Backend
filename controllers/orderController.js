const Order=require('../models/orderModel')
const Product=require('../models/productModels')
const asyncHandler=require('express-async-handler')
const ErrorHandler=require('../utils/errorHandler')

//New Order
exports.newOrder=asyncHandler(async(req,res,next)=>{

    const{shippingInfo,taxPrice,totalPrice,paymentInfo,itemsPrice,orderItems,shippingPrice}=req.body

    const order=await Order.create({
        shippingInfo,taxPrice,totalPrice,paymentInfo,itemsPrice,orderItems,shippingPrice,payedAt:Date.now,
        user:req.user._id
    })
    res.status(200).json({success:true, order})
})

//Get single Order
exports.getSingleOrder=asyncHandler(async(req,res,next)=>{

    const order=await Order.findById(req.params.id).populate("user","name email")
    if(!order){

        return next(new ErrorHandler('Order not found',404))
    }
    res.status(200).json({success:true,order})
})

//My oders
exports.myOrders=asyncHandler(async(req,res,next)=>{

    const orders=await Order.find({user:req.user._id})
    res.status(200).json({success:true,orders})
})

//Get all orders --ADMIN
exports.getAllOrders=asyncHandler(async(req,res,next)=>{

    const orders= await Orders.find()
    let totalAmount=0
    orders.forEach(order=>{
        totalAmount+=orders.totalPrice
    })
    res.status(200).json({success:true,orders,totalAmount})
})

//Update order status --ADMIN
exports.updateOrder=asyncHandler(async(req,res,next)=>{

    const order=await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found",404))
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("Order has been delivered"),200)
    }
    order.orderItems.forEach(async (order)=>{
        await updateStock(order.product,order.quantity)
    })
    order.orderStatus=req.body.status
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now()
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({success:true})
})

async function updateStock(id,quantity){

    const product=await Product.findById(id)
    product.stock-=quantity
    await product.save({validateBeforeSave:false})
}

//Delete order
exports.deleteOrder=asyncHandler(async(req,res,next)=>{

    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found",404))
    }
    await order.deleteOne()
})