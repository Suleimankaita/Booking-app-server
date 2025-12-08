const express=require('express');
const route=express()
const RemoveAll_cate=require('../Controllers/removeCategory')

route.route('/')
.delete(RemoveAll_cate)

module.exports=route