const express=require('express');
const Registration=require('../Controllers/Req')
const Auth=require('../Controllers/Auth')
const route=express()

route.route('/Regs')
.post(Registration)
route.route('/Auth')
.post(Auth)

module.exports=route;
