const express=require('express');
const RemoveBook=require('../Controllers/RemoveBoomark')
const route=express()

route.route('/')
.delete(RemoveBook)

module.exports=route;
