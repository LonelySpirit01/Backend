const express=require('express')
const { getAllProducts, createProduct, updateProducts, 
    deleteProduct, getDetails, createReview, 
    getAllReviews,
    deleteReview} = require('../controllers/productControllers')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const router=express.Router()

router.route("/products").get( getAllProducts)

router.route("/admin/products/new").post(isAuthenticatedUser ,authorizeRoles("admin"),createProduct)

router.route("/admin/products/:id").put(isAuthenticatedUser ,authorizeRoles("admin"),updateProducts)
.delete(isAuthenticatedUser ,authorizeRoles("admin"),deleteProduct)

router.route('/product/:id').get(getDetails)

router.route('/review').put(isAuthenticatedUser,createReview)

router.route('/reviews').get(getAllReviews).delete(isAuthenticatedUser,deleteReview)

module.exports=router