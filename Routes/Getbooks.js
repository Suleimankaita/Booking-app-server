const express=require('express');
const GetBooks=require('../Controllers/GetBooks')
const route=express()

route.route('/')
.get(GetBooks)

module.exports=route;
