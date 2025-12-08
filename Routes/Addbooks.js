const express=require('express');
const AddBooks=require('../Controllers/AddBooks')
const route=express()

route.route('/')
.post(AddBooks)

module.exports=route;
