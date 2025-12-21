const express=require('express');
const UpdateProfile=require('../Controllers/UpadeBook')
const route=express()

route.route('/')
.patch(UpdateProfile)

module.exports=route;
