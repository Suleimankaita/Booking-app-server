const express=require('express');
const StartTrial=require('../Controllers/StartTrial')
const route=express()

route.route('/')
.post(StartTrial)

module.exports=route;
