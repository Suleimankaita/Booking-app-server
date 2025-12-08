const express=require('express');
const GetUsers=require('../Controllers/AllUser')
const route=express()

route.route('/')
.get(GetUsers)

module.exports=route;
