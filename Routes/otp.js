const express=require('express');
const {sendOtp,resetPassword,verifyOtp}=require('../Controllers/Otp')
const route=express()

route.route('/Sendotp')
.post(sendOtp)
route.route('/VerifyOtp')
.post(verifyOtp)
route.route('/resetOtp_password')
.post(resetPassword)

module.exports=route;
    