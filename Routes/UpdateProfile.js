const express=require('express');
const UpdateProfile=require('../Controllers/EditProfile')
const route=express()

route.route('/')
.patch(UpdateProfile)

module.exports=route;
