const express=require('express');
const route=express()
const sold=require('../Controllers/GetCategproes')

route.route('/')
.get(sold)

module.exports=route