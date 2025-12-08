
const express=require('express');
const route=express()
const Addcategories=require('../Controllers/addcategories')

route.route('/')
.post(Addcategories)

module.exports=route