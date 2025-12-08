const express=require('express');
const Trials=require('../Controllers/Getrials')
const route=express()

route.route('/')
.get(Trials)

module.exports=route;
