const express=require('express');
const Converter=require('../Controllers/Converter')
const route=express()

route.route('/')
.post(Converter)

module.exports=route;
