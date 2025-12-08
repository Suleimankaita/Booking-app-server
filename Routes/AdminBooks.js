const express=require('express');
const GetBooks=require('../Controllers/AllBooks')
const route=express()

route.route('/')
.get(GetBooks)

module.exports=route;
