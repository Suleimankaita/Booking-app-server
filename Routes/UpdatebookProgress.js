const express=require('express');
const UpdateBookPage=require('../Controllers/UpdateBookPage')
const route=express()

route.route('/')
.patch(UpdateBookPage)

module.exports=route;
