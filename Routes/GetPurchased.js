const express=require('express');
const GetPurchased=require('../Controllers/GetPurchased')
const route=express()

route.route('/')
.get(GetPurchased)

module.exports=route;
