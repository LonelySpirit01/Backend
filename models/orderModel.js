const mongoose= require('mongoose')

const orderSchema= new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,    
            required:[true,"Please enter your address"]
        },
        country:{
            type:String,
            required:[true,"Please enter Country"]
        },
        state:{
            type:String,
            required:[true,"Please enter State"]
        },
        pincode:{
            type:Number,
            required:[true,"Please enter pincode"]
        },
        phoneNo:{
            type:Number,
            required:[true,"Please enter your number"]
        }
    },
    orderItems:[{
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:String,
            required:true
        },
        image:{
            type:String,
            require:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
            required:true
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
    paymentInfo:{
            id:{
                type:String,
                required:true
            },
            status:{
                type:String,
                required:true
            }
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemsPrice:{
        type:Number,
        default:0,
        required:true
    },
    taxPrice:{
        type:String,
        default:0,
        required:true
    },
    shippingPrice:{
        type:Number,
        default:0,
        required:true
    },
    totalPrice:{
        type:String,
        default:0,
        required:true
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
    })

    module.exports=mongoose.model("Order",orderSchema)