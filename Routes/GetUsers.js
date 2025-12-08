const express=require('express');
const GetUsers=require('../Controllers/GetUsers')
const route=express()

route.route('/')
.get(GetUsers)

module.exports=route;
