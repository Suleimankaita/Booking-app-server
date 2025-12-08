const express=require('express');
const Purchased=require('../Controllers/PurchasedBook')
const route=express()

route.route('/')
.post(Purchased)

module.exports=route;
