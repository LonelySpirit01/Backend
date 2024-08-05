const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide name of the product"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please provide product description"]
    },
    price:{
        type:Number,
        required:[true,"Please provide product price"],
        maxLength:[8,"Price can't exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please provide product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please provide product stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{
            type:String,
            required:true
        },
        ratings:{
            type:Number,
            required:true
        },
        comments:{
            type:String,
            required:true
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Product",productSchema)