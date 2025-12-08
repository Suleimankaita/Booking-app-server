const User=require('../model/User')
const asynchandler=require('express-async-handler');

const GetUsers=asynchandler(async(req,res)=>{
    try{
        const list=await User.find().populate("NameId")
        res.status(201).json(list)
    }catch(err){
        res.status(400).json({'message':err.message})
    }
}) 

module.exports=GetUsers;