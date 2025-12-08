const express=require('express');
const GetPurchasedBook=require('../Controllers/GetPurchasedBook')
const route=express()

route.route('/')
.get(GetPurchasedBook)

module.exports=route;
