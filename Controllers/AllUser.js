const User = require('../model/User');
const Users=require('../model/User')
const asynchandler=require('express-async-handler');

const GetUsers=asynchandler(async(req,res)=>{

    try{
        const Allusers=await User.find().populate('NameId').populate('pursedBooksID').populate('TrialID')
        if(!Allusers)return res.status(404).json({'message':'No Users to display'});
        
        res.status(201).json(Allusers) 
    }catch(err){
        res.status(500).json({'message':err.message})
    }
})

module.exports=GetUsers