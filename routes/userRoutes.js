const express=require('express')
const { registerUser, loginUser, logOut, forgetPassword, resetPassword, 
    getUserDetails, updatePassword, updateProfile, findUsers, 
    getUser,
    updateUserRole,
    deleteUser} = require('../controllers/userController')
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')
const router= express.Router()

router.route("/register").post(registerUser)

router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgetPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logOut)

router.route('/me').get(isAuthenticatedUser ,getUserDetails)

router.route('/update/password').put(isAuthenticatedUser,updatePassword)

router.route('/me/profile').put(isAuthenticatedUser,updateProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles("admin"),findUsers)

router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles("admin"),getUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)


module.exports=router