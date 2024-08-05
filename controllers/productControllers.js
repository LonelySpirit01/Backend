const productSchema=require("../models/productModels")
const ApiFeatures = require("../utils/apiFeatures")
const ErrorHandler = require("../utils/errorHandler")
const asyncHandler=require('express-async-handler')
const User=require('../models/userModels')

//Create Product --ADMIN
exports.createProduct=asyncHandler(async(req,res,next)=>{
    req.body.user=req.user.id
    const product=await(productSchema.create(req.body))
    res.status(201).json({
        success:true,
        product
    })
})

//Get one product
exports.getDetails=asyncHandler(async(req,res,next)=>{
    const product =await productSchema.findById(req.params.id)
    if(!product){
       return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).json({success:true,product})
})

//Get all products
exports.getAllProducts=asyncHandler(async(req,res,next)=>{

    const resultPerPage= 5
    const productCount = await productSchema.countDocuments()
    const apiFeature= new ApiFeatures(productSchema.find(),req.query)
    .search().filter()
    
    let products=await apiFeature.query
   let filteredProductsCount= products.length
   

    apiFeature.pagination(resultPerPage)
    
    res.status(200).json({ success:true,
        products,productCount,resultPerPage,
        filteredProductsCount})
})

//Update Products with id --ADMIN
exports.updateProducts=asyncHandler(async(req,res,next)=>{
let product=await (productSchema.findById(req.params.id))
if(!product){
    return next(new ErrorHandler("Product not found",404))
}
product=await (productSchema.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false}))
res.status(200).json({success:true,product})
})

//Delete product with id --ADMIN
exports.deleteProduct=asyncHandler(async(req,res,next)=>{
    const product =await productSchema.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    await product.deleteOne()
    res.status(200).json({success:true,message:"Product deleted successfully"})
})

//Create or update review
exports.createReview=asyncHandler(async(req,res,next)=>{

    const {product_id, comment,rating}=req.body
    const review= {
        name:req.user.name,
        ratings:Number(rating),
         comment,
        user:req.user._id
    }

    const product= await productSchema.findById(product_id)
    const isReviewed= await product.reviews.find((rev)=> rev.user.toString()===req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating
                rev.comment=comment
            }
        } )
    }
    else{
        product.reviews.push(review)
        product.numOfReviews= product.reviews.length
    }

    let avg=0
    product.ratings=product.reviews.forEach((rev)=>{
        avg+=rev.rating
    })
    product.ratings=product.reviews.length

    await product.save({validateBeforeSave:false})
    res.status(200).json({success:true})
})

//Get all reviews
exports.getAllReviews=asyncHandler(async(req,res,next)=>{

    const product= await productSchema.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    res.status(200).json({success:true, reviews:product.reviews})
})

//Delete review
exports.deleteReview=asyncHandler(async(req,res,next)=>{

    const product= await productSchema.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    const reviews= product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())
    let avg=0
    reviews.forEach((rev)=>{
        avg+=rev.rating
    } )

    const ratings=avg/reviews.length
    const numOfReviews=reviews.length

    await productSchema.findByIdAndUpdate(req.query.productId,{ reviews,ratings,numOfReviews},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({success:true})
})