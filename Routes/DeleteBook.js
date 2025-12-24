const express=require('express');
const RemoveBook=require('../Controllers/DeleteBook')
const route=express()

route.route('/')
.delete(RemoveBook)

module.exports=route;
